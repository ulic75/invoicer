(function () {
	'use strict';
	var controllerId = 'invoices';
	angular.module('app').controller(controllerId, ['$routeParams', 'common', 'config', 'datacontext', invoices]);

	function invoices($routeParams, common, config, datacontext) {
		var vm = this;
		var keyCodes = config.keyCodes;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.filteredInvoices = [];
		vm.invoices = [];
		vm.invoiceCount = 0;
		vm.invoiceFilteredCount = 0;
		vm.invoicesSearch = $routeParams.id || '';
		vm.pageChanged = pageChanged;
		vm.paging = {
			currentPage: 1,
			maxPagesToShow: 5,
			pageSize: 5
		}
		vm.search = search;
		vm.title = 'Invoices';
		vm.refresh = refresh;

		Object.defineProperty(vm.paging, 'pageCount', {
			get: function () {
				return Math.floor(vm.invoiceFilteredCount / vm.paging.pageSize) + 1;
			}
		});

		activate();

		function activate() {
			common.activateController([getInvoices()], controllerId)
                .then(function () {
                	log('Activated Invoices View');
                });
		}

		function getInvoiceCount() {
			return datacontext.getInvoiceCount().then(function (data) {
				return vm.invoiceCount = data;
			});
		}

		function getInvoiceFilteredCount() {
			vm.invoiceFilteredCount = datacontext.getInvoiceFilteredCount(vm.invoicesSearch);
		}

		function getInvoices(forceRefresh) {
			return datacontext.getInvoices(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.invoicesSearch).then(function (data) {
				vm.invoices = data;
				if (!vm.invoiceCount || forceRefresh) {
					getInvoiceCount();
				}
				getInvoiceFilteredCount();
				return data;
			});
		}

		function refresh() { getInvoices(true); }

		function search($event) {
			if ($event.keyCode === keyCodes.esc) {
				vm.invoicesSearch = '';
			}
			getInvoices();
		}

		function pageChanged(page) {
			if (!page) { return; }
			vm.paging.currentPage = page;
			getInvoices();
		}

	}
})();