(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'config', 'entityManagerFactory', datacontext]);

    function datacontext(common, config, emFactory) {
    	var EntityQuery = breeze.EntityQuery;
    	var getLogFn = common.logger.getLogFn;
    	var log = getLogFn(serviceId);
    	var logError = getLogFn(serviceId, 'error');
    	var logSuccess = getLogFn(serviceId, 'success');
    	var manager = emFactory.newManager();
    	var primePromise = false;
    	var $q = common.$q;

    	var entityNames = {
    		client: 'Client',
    		lineitemdescription: 'LineItemDescription'
    	};

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getClients: getClients,
            getInvoices: getInvoices,
			prime: prime
        };

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

        function getClients() {
        	var orderBy = 'alias';
        	var clients = [];

        	return EntityQuery.from('Clients')
				.orderBy(orderBy)
				.using(manager).execute()
				.then(querySucceeded, _queryFailed);

        	function querySucceeded(data) {
        		clients = data.results;
        		log('Retrieved [Clients] from remote data source', clients.length, true);
        		return clients;
        	}
        }

        function getInvoices() {
        	var orderBy = 'id';
        	var invoices = [];

        	return EntityQuery.from('Invoices')
				.orderBy(orderBy)
				.using(manager).execute()
				.then(querySucceeded, _queryFailed);

        	function querySucceeded(data) {
        		invoices = data.results;
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

        	primePromise = $q.all([getLookups(), getClients()])
				.then(extendMetadata)
				.then(success);
        	return primePromise;

        	function success() {
        		setLookups();
        		log('Primed the data');
        	};

        	function extendMetadata() {
        		var metadataStore = manager.metadataStore;
        		var types = metadataStore.getEntityTypes();
        		types.forEach(function (type) {
        			if (type instanceof breeze.EntityType) {
						set(type.shortName, type)
        			}
        		});

        		function set(resourceName, entityName) {
        			metadataStore.setEntityTypeForResourceName(resourceName, entityName);
        		}
        	};
        }

        function setLookups() {
        	service.lookupCachedData = {
        		lineitemdescriptions: _getAllLocal(entityNames.lineitemdescription, 'description')
        	};
        }

        function _getAllLocal(resource, ordering) {
        	return EntityQuery.from(resource)
				.orderBy(ordering)
				.using(manager)
				.executeLocally();
        }

        function _queryFailed(error) {
        	var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
        	logError(msg, error);
        	throw error;
        }
    }
})();