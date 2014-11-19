(function () {
    'use strict';

    var serviceId = 'repository.invoice';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositoryInvoice]);

    function RepositoryInvoice(model, AbstractRepository) {
        var entityName = model.entityNames.invoice;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'id';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
        	// Exposed data access functions
            this.getAll = getAll;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLocal()
        function getAllLocal() {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            return self._getAllLocal(entityName, orderBy, predicate);
        }

        function getAll(forceRemote, page, size, filter) {
        	var self = this;
        	// Only return a page worth of attendees
        	var take = size || 20;
        	var skip = page ? (page - 1) * size : 0;

        	if (self._areItemsLoaded() && !forceRemote) {
        		// Get the page of invoices from local cache
        		return self.$q.when(getByPage());
        	}

        	// Load all invoices to cache via remote query
        	return EntityQuery.from('Invoices')
                //.select('id, payments')
                .orderBy(orderBy)
				.expand(['lineItems', 'lineItems.lineItemDescription', 'payments'])
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

        	function querySucceeded(data) {
        		self._areItemsLoaded(true);
        		var invoices = data.results;
        		for (var i = invoices.length; i--;) {
        			invoices[i].stringId = invoices[i].id;
        		}
        		self.log('Retrieved [Invoice] from remote data source', invoices.length, true);
        		return getByPage();
        	}

        	function getByPage() {
        		var predicate = null;

        		if (filter) {
        			predicate = _searchPredicate(filter);
        		}

        		var invoices = EntityQuery.from(entityName)
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

        		return invoices;
        	}
        }

        function getCount() {
        	var self = this;
        	if (self._areItemsLoaded()) {
        		return self.$q.when(self._getLocalEntityCount(entityName));
        	}

        	return EntityQuery.from('Invoices').take(0).inlineCount()
				.using(self.manager).execute()
				.then(self._getInlineCount);
        }

    	function getFilteredCount(filter) {
    		var predicate = _searchPredicate(filter);
    		var invoices = EntityQuery.from('Invoices')
    			.where(predicate)
    			.using(this.manager)
    			.executeLocally();
    		return invoices.length;
    	}

    	function _searchPredicate(filter) {
    		return Predicate.create('client.name', 'contains', filter)
    			.or('stringId', 'contains', filter);
    	}

    }
})();