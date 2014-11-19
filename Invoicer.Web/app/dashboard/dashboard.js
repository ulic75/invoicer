(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.content = {
        	invoices: [],
        	predicate: '',
        	setContentSort: setContentSort,
			title: 'Content',
			reverse: false,
        };
        vm.news = {
        		title: 'Invoicer',
        		description: 'Invoicer is an application for processing invoices.'
        };
        vm.clientCount = 0;
        vm.invoiceCount = 0;
        vm.title = 'Dashboard';

        activate();

        function activate() {
        	var promises = [getClientCount(), getInvoiceCount(), getInvoices()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getClientCount() {
        	return datacontext.client.getCount().then(function (data) {
        		return vm.clientCount = data;
        	});
        }

        function getInvoiceCount() {
        	return datacontext.invoice.getCount().then(function (data) {
        		return vm.invoiceCount = data;
        		//return vm.invoiceCount = 13;
        	});
        }

		function getInvoices() {
			//return datacontext.getInvoices().then(function (data) {
			//	return vm.content.invoices = data;
			//});
		}

		function setContentSort(prop) {
			vm.content.predicate = prop;
			vm.content.reverse = !vm.content.reverse;
		}

    }
})();