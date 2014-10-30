(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'config', 'entityManagerFactory', 'model', datacontext]);

    function datacontext(common, config, emFactory, model) {
    	var EntityQuery = breeze.EntityQuery;
		var entityNames = model.entityNames;
    	var getLogFn = common.logger.getLogFn;
    	var log = getLogFn(serviceId);
    	var logError = getLogFn(serviceId, 'error');
    	var logSuccess = getLogFn(serviceId, 'success');
    	var manager = emFactory.newManager();
    	var primePromise = false;
    	var $q = common.$q;

    	var storeMeta = {
    		isLoaded: {
    			invoices: false,
    		}
    	}

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getClients: getClients,
            getInvoices: getInvoices,
			prime: prime
        }

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function getClients(forceRefresh) {
        	var orderBy = 'alias';
        	var clients = [];

        	if (!forceRefresh) {
        		clients = _getAllLocal(entityNames.client, orderBy);
        		return $q.when(clients);
        	}

        	return EntityQuery.from('Clients')
				.orderBy(orderBy)
				.toType(entityNames.client)
				.using(manager).execute()
				.then(querySucceeded, _queryFailed);

        	function querySucceeded(data) {
        		clients = data.results;
        		log('Retrieved [Clients] from remote data source', clients.length, true);
        		return clients;
        	}
        }

        function getInvoices(forceRefresh) {
			// Used as a where statement
        	// var predicate = breeze.Predicate.create('isActive', '==', true);
        	var orderBy = 'id';
        	var invoices = [];

        	if (_areInvoicesLoaded() && !forceRefresh) {
        		invoices = _getAllLocal(entityNames.invoice, orderBy);
        		return $q.when(invoices);
        	}

        	return EntityQuery.from('Invoices')
				.orderBy(orderBy)
				.toType(entityNames.invoice)
				.using(manager).execute()
				.then(querySucceeded, _queryFailed);

        	function querySucceeded(data) {
        		invoices = data.results;
        		_areInvoicesLoaded(true);
				// Example how to set extended values
        		//for (var i = invoices.length; i--;) {
        		//	invoices[i].isActive = true;
				//}
        		log('Retrieved [Invoices] from remote data source', invoices.length, true);
        		return invoices;
        	}
        }

        function getLookups() {
        	return EntityQuery.from('Lookups')
				.using(manager).execute()
				.then(querySucceeded, _queryFailed);

        	function querySucceeded(data) {
        		log('Retrieved [Lookups]', data, true);
        		return true;
        	}
        }

        function prime() {
        	if (primePromise) return primePromise;

        	primePromise = $q.all([getLookups(), getClients(true)])
				.then(extendMetadata)
				.then(success);
        	return primePromise;

        	function success() {
        		setLookups();
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

        function setLookups() {
        	service.lookupCachedData = {
        		lineitemdescriptions: _getAllLocal(entityNames.lineitemdescription, 'description')
        	};
        }

        function _getAllLocal(resource, ordering, predicate) {
        	return EntityQuery.from(resource)
				.where(predicate)
				.orderBy(ordering)
				.using(manager)
				.executeLocally();
        }

        function _queryFailed(error) {
        	var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
        	logError(msg, error);
        	throw error;
		}

        function _areInvoicesLoaded(value) {
        	return _areItemsLoaded('invoices', value);
        }

        function _areItemsLoaded(key, value) {
        	if (value === undefined) {
        		return storeMeta.isLoaded[key];
        	}
        	return storeMeta.isLoaded[key] = value;
        }

    }
})();