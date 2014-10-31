(function () {
	'use strict';
	var controllerId = 'clients';
	angular.module('app').controller(controllerId, ['common', 'config', 'datacontext', clients]);

	function clients(common, config, datacontext) {
		var vm = this;
		var keyCodes = config.keyCodes;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.clients = [];
		vm.clientSearch = '';
		vm.filteredClients = [];
		vm.title = 'Clients';
		vm.refresh = refresh;
		vm.search = search;

		activate();

		function activate() {
			common.activateController([getClients()], controllerId)
                .then(function () { log('Activated Clients View'); });
		}

		function getClients(forceRefresh) {
			return datacontext.getClients(forceRefresh).then(function (data) {
				vm.clients = data;
				applyFilter();
				return vm.clients;
			});
		}

		function refresh() { getClients(true); }

		function search($event) {
			if ($event.keyCode === keyCodes.esc) {
				vm.clientSearch = '';
			}
			applyFilter();
		}

		function applyFilter() {
			vm.filteredClients = vm.clients.filter(clientFilter);
		}

		function clientFilter(client) {
			var isMatch = vm.clientSearch ? common.textContains(client.name, vm.clientSearch) : true;
			return isMatch;
		}
	}
})();