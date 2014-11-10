(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.news = {
            title: 'Invoicer',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.clientCount = 0;
        vm.invoiceCount = 0;
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getClientCount(), getInvoiceCount()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getClientCount() {
        	return datacontext.getClientCount().then(function (data) {
        		return vm.clientCount = data;
        	});
        }

        function getInvoiceCount() {
        	return datacontext.getInvoiceCount().then(function (data) {
        		return vm.invoiceCount = data;
        	});
        }

    }
})();