(function () {
	'use strict';
	var controllerId = 'invoices';
	angular.module('app').controller(controllerId, ['common', 'datacontext', invoices]);

	function invoices(common, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.invoices = [];
		vm.title = 'Invoices';

		activate();

		function activate() {
			common.activateController([getInvoices()], controllerId)
                .then(function () { log('Activated Invoices View'); });
		}

		function getInvoices() {
			return datacontext.getInvoices().then(function (data) {
				return vm.invoices = data;
			});
		}

	}
})();