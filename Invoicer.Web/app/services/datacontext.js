(function () {
	'use strict';

	var serviceId = 'datacontext';
	angular.module('app').factory(serviceId, ['common', 'config', 'entityManagerFactory', 'model', 'repositories', datacontext]);

	function datacontext(common, config, emFactory, model, repositories) {
		//var EntityQuery = breeze.EntityQuery;
		//var Predicate = breeze.Predicate;
		var entityNames = model.entityNames;
		var events = config.events;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(serviceId);
		var logError = getLogFn(serviceId, 'error');
		var logSuccess = getLogFn(serviceId, 'success');
		var manager = emFactory.newManager();
		var primePromise;
		var repoNames = ['client', 'invoice', 'lookup'];
		var $q = common.$q;

		var service = {
			cancel: cancel,
			prime: prime,
			save: save
			// Repositories to be added on demand:
			//      clients
			//		invoices
			//      lookups
		}

		init();

		return service;

		function init() {
			repositories.init(manager);
			defineLazyLoadedRepos();
			setupEventForHasChangesChanged();
		}

		function cancel() {
			manager.rejectChanges();
			logSuccess('Cancelled changes', null, true);
		}

		// Add ES5 property to datacontext for each named repo
		function defineLazyLoadedRepos() {
			repoNames.forEach(function (name) {
				Object.defineProperty(service, name, {
					configurable: true, // will redefine this property once
					get: function () {
						// The 1st time the repo is request via this property, 
						// we ask the repositories for it (which will inject it).
						var repo = repositories.getRepo(name);
						// Rewrite this property to always return this repo;
						// no longer redefinable
						Object.defineProperty(service, name, {
							value: repo,
							configurable: false,
							enumerable: true
						});
						return repo;
					}
				});
			});
		}

		function prime() {
			if (primePromise) return primePromise;

			primePromise = $q.all([service.lookup.getAll(), service.client.getAll(true)])
				.then(extendMetadata)
				.then(success);
			return primePromise;

			function success() {
				service.lookup.setLookups();
				log('Primed the data');
			}

			function extendMetadata() {
				var metadataStore = manager.metadataStore;
				var types = metadataStore.getEntityTypes();
				types.forEach(function (type) {
					if (type instanceof breeze.EntityType) { set(type.shortName, type) }
				});

				function set(resourceName, entityName) {
					metadataStore.setEntityTypeForResourceName(resourceName, entityName);
				}
			}
		}

		function save() {
			return manager.saveChanges().then(saveSucceeded, saveFailed);

			function saveSucceeded(result) {
				logSuccess('Saved data', result, true);
			}

			function saveFailed(error) {
				var msg = config.appErrorPrefix + 'Save failed:' + breeze.saveErrorMessageService.getErrorMessage(error);
				error.message = msg;
				logError(msg, error);
				throw error;
			}
		}

		function setupEventForHasChangesChanged() {
			manager.hasChangesChanged.subscribe(function (eventArgs) {
				var data = { hasChanges: eventArgs.hasChanges };
				common.$broadcast(events.hasChangesChanged, data);
			})
		}
	}
})();