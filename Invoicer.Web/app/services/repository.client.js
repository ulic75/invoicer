(function () {
    'use strict';

    var serviceId = 'repository.client';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositoryClient]);

    function RepositoryClient(model, AbstractRepository) {
        var entityName = model.entityNames.client;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'alias';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getAllLocal = getAllLocal;
        	//this.getTopLocal = getTopLocal;
            this.getById = getById;
            this.getCount = getCount;
            this.getPartials = getPartials;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getAllLocal() {
            var self = this;
            return self._getAllLocal(entityName, orderBy);
        }

        function getById(id, forceRemote) {
        	return this._getById(entityName, id, forceRemote);
        }

        function getCount() {
        	var self = this;
        	if (self._areItemsLoaded()) {
        		return self.$q.when(self._getLocalEntityCount(entityName));
        	}

        	return EntityQuery.from('Clients').take(0).inlineCount()
				.using(self.manager).execute()
				.then(self._getInlineCount);
        }

        // Formerly known as datacontext.getSpeakerPartials()
        function getPartials(forceRemote) {
        	var self = this;
        	var clients = [];
            var clientOrderBy = 'alias';

            if (!forceRemote) {
            	clients = self._getAllLocal(entityName, clientOrderBy);
                return self.$q.when(clients);
            }

            return EntityQuery.from('Clients')
                .select('id, name, alias')
                .orderBy(clientOrderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
            	clients = data.results;
            	for (var i = clients.length; i--;) {
            		clients[i].isPartial = true;
            	}
                self.log('Retrieved [Client Partials] from remote data source', clients.length, true);
                return clients;
            }
        }

        // Formerly known as datacontext.getSpeakersTopLocal()
        function getTopLocal() {
            var self = this;
            var predicate = Predicate.create('lastName', '==', 'Papa')
                .or('lastName', '==', 'Guthrie')
                .or('lastName', '==', 'Bell')
                .or('lastName', '==', 'Hanselman')
                .or('lastName', '==', 'Lerman')
                .and('isSpeaker', '==', true);

            return self._getAllLocal(entityName, orderBy, predicate);
        }
    }
})();