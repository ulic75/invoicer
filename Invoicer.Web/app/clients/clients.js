(function () {
	'use strict';
	var controllerId = 'clients';
	angular.module('app').controller(controllerId, ['common', 'datacontext', clients]);

	function clients(common, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.clients = [];
		vm.title = 'Clients';
		vm.refresh = refresh;

		activate();

		function activate() {
			common.activateController([getClients()], controllerId)
                .then(function () { log('Activated Clients View'); });
		}

		function getClients(forceRefresh) {
			return datacontext.getClients(forceRefresh).then(function (data) {
				return vm.clients = data;
			});
		}

		function refresh() { getClients(true); }

	}
})();