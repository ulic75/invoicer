(function () {
	'use strict';
	var controllerId = 'clients';
	angular.module('app').controller(controllerId, ['$location', 'common', 'config', 'datacontext', clients]);

	function clients($location, common, config, datacontext) {
		var vm = this;
		var keyCodes = config.keyCodes;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.active = 1;
		vm.activeChanged = activeChanged;
		vm.clients = [];
		vm.clientSearch = '';
		vm.filteredClients = [];
		vm.gotoClient = gotoClient;
		vm.title = 'Clients';
		vm.refresh = refresh;
		vm.search = search;

		activate();

		function activate() {
			common.activateController([getClients()], controllerId)
                .then(function () { log('Activated Clients View'); });
		}

		function activeChanged() {
			getClients();
		}

		function getClients(forceRemote) {
			return datacontext.client.getAll(forceRemote).then(function (data) {
				vm.clients = data;
				applyFilter();
				return vm.clients;
			});
		}

		function gotoClient(client) {
			if (client && client.id) {
				$location.path('/client/' + client.id);
			}
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
			if (Number(vm.active) != 2 && client.active != Number(vm.active)) { return false };
			var isMatch = vm.clientSearch ? common.textContains(client.name, vm.clientSearch) : true;
			return isMatch;
		}
	}
})();