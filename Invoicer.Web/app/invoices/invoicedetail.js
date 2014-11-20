(function () {
	'use strict';
	var controllerId = 'invoicedetail';
	angular.module('app').controller(controllerId, ['$routeParams', '$scope', '$window', 'common', 'config', 'datacontext', invoicedetail]);

	function invoicedetail($routeParams, $scope, $window, common, config, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.cancel = cancel;
		vm.clients = [];
		vm.getTitle = getTitle;
		vm.invoice = undefined;
		vm.goBack = goBack;
		vm.hasChanges = false;
		vm.lineItemDescriptions = [];
		vm.isSaving = false;
		vm.save = save;

		Object.defineProperty(vm, 'canSave', { get: canSave	});
		
		activate();

		function activate() {
			initLookups();
			onDestroy();
			onHasChanges();
			common.activateController([getInvoice()], controllerId)
                .then(function () {
                	log('Activated Invoice View');
                });
		}

		function cancel() {	datacontext.cancel(); }

		function canSave() { return vm.hasChanges && !vm.isSaving; }

		function getInvoice() {
			var id = $routeParams.id;
			return datacontext.invoice.getById(id).then(function (data) {
				vm.invoice = data;
			}), function (error) {
				logError('Unable to get invoice ' + id);
			}
		}

		function getTitle() {
			return 'Edit Invoice ' + ((vm.invoice && vm.invoice.id) || '');
		}
		
		function goBack() { $window.history.back(); }
		
		function initLookups() {
			var lookups = datacontext.lookup.lookupCachedData;
			vm.lineItemDescriptions = lookups.lineitemdescriptions;
			vm.clients = datacontext.client.getAllLocal(true);
		}

		function onDestroy() {
			$scope.$on('$destroy', function () {
				datacontext.cancel();
			})
		}

		function onHasChanges() {
			$scope.$on(config.events.hasChangesChanged, function (event, data) {
				vm.hasChanges = data.hasChanges;
			});
		}

		function save() {
			if (!canSave()) { return $q.when(null); }
			vm.isSaving = true;
			return datacontext.save().then(function (saveResult) {
				vm.isSaving = false;
			}, function (error) {
				vm.isSaving = false;
			});
		}
	}
})();