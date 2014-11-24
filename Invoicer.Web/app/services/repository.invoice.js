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
            this.create = create;
            this.getAll = getAll;
            this.getById = getById;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function create() {
        	var endOfLastMonth = moment().utc().subtract(1, 'month').endOf('month')
        	var invoice = this.manager.createEntity(entityName, {date: endOfLastMonth});
        	var lineitem = invoice.getProperty('lineItems');
        	lineitem.push(this.manager.createEntity('LineItem', { unitPrice: 65, quantity: 1, descriptionId: 2 }));
        	//lineitem.invoice(invoice);
        	return invoice;
        }
        
        function getAll(forceRemote, page, size, filter, outstanding) {
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
				.where('date', 'gt', '2/1/2013')
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
        			invoices[i].outstanding = invoices[i].total - invoices[i].totalPayments;
        		}
        		self.log('Retrieved [Invoice] from remote data source', invoices.length, true);
        		return getByPage();
        	}

        	function getByPage() {
        		var predicate = null;

        		if (filter) {
        			predicate = _searchPredicate(filter);
        		}
       			var oPredicate = _outstandingPredicate(outstanding);
       			predicate = Predicate.and(predicate, oPredicate);

        		var invoices = EntityQuery.from(entityName)
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

        		return invoices;
        	}
        }

        function getById(id, forceRemote) {
        	var self = this;
        	var manager = self.manager;

        	if (!forceRemote) {
        		var entity = manager.getEntityByKey(entityName, id);
        		if (entity) {
        			self.log('Retrieved [' + entityName + '] id:' + entity.id + ' from cache.', entity, true);
        			if (entity.entityAspect.entityState.isDeleted()) {
        				entity = null;
        			}
        			return self.$q.when(entity);
        		}
        	}

        	return EntityQuery.from('Invoices')
				.where('id', 'eq', id)
				.expand(['lineItems', 'lineItems.lineItemDescription', 'payments'])
				.using(manager).execute()
				.then(querySucceeded, self._queryFailed);

        	function querySucceeded(data) {
        		var entity = data.results[0];
        		if (!entity) {
        			self.log('Could not find [' + entityName + '] id:' + id, null, true);
        			return null;
        		}
        		self.log('Retrieved [' + entityName + '] id:' + entity.id + ' from remote data source.', entity, true);
        		return entity;
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

    	function getFilteredCount(filter, outstanding) {
    		var predicate = Predicate.and(_searchPredicate(filter),_outstandingPredicate(outstanding));
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

    	function _outstandingPredicate(outstanding) {
    		return Number(outstanding) === 1 ? Predicate.create('outstanding', 'gt', 0) : null;
    	}
    }
})();