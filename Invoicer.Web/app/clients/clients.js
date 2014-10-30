﻿(function () {
	'use strict';
	var controllerId = 'clients';
	angular.module('app').controller(controllerId, ['common', 'datacontext', clients]);

	function clients(common, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.clients = [];
		vm.title = 'Clients';

		activate();

		function activate() {
			common.activateController([getClients()], controllerId)
                .then(function () { log('Activated Clients View'); });
		}

		function getClients() {
			return datacontext.getClients().then(function (data) {
				return vm.clients = data;
			});
		}

	}
})();