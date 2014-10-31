(function () {
	'use strict';
	var controllerId = 'invoices';
	angular.module('app').controller(controllerId, ['common', 'config', 'datacontext', invoices]);

	function invoices(common, config, datacontext) {
		var vm = this;
		var keyCodes = config.keyCodes;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var applyFilter = function () { };

		vm.filteredInvoices = [];
		vm.invoices = [];
		vm.invoicesFilter = invoicesFilter;
		vm.invoicesSearch = '';
		vm.search = search;
		vm.title = 'Invoices';
		vm.refresh = refresh;

		activate();

		function activate() {
			common.activateController([getInvoices()], controllerId)
                .then(function () {
                	// createSearchThrottle uses values by convention, via it's parameters:
                	//	vm.invoicesSearch is where the user enters the search
                	//	vm.invoices is the original unfiltered array
                	//	vm.filteredInvoices is the filtered array
					//	vm.invoicesFilter is the filtering function
                	applyFilter = common.createSearchThrottle(vm, 'invoices');
                	if (vm.invoicesSearch) { applyFilter(true); }
                	log('Activated Invoices View');
                });
		}

		function getInvoices(forceRefresh) {
			return datacontext.getInvoices(forceRefresh).then(function (data) {
				return vm.invoices = vm.filteredInvoices = data;
			});
		}

		function refresh() { getInvoices(true);	}

		function search($event) {
			if ($event.keyCode === keyCodes.esc) {
				vm.invoicesSearch = '';
				applyFilter(true);
			} else {
				applyFilter();
			}
		}

		function invoicesFilter(invoice) {
			var textContains = common.textContains;
			var searchText = vm.invoicesSearch;
			var isMatch = searchText ?
				textContains(invoice.client.name, searchText)
					|| textContains(invoice.id, searchText)
				: true;
			return isMatch;
		}

	}
})();