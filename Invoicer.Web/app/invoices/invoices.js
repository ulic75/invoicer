(function () {
	'use strict';
	var controllerId = 'invoices';
	angular.module('app').controller(controllerId, ['$location', '$routeParams', 'common', 'config', 'datacontext', invoices]);

	function invoices($location, $routeParams, common, config, datacontext) {
		var vm = this;
		var keyCodes = config.keyCodes;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.filteredInvoices = [];
		vm.gotoInvoice = gotoInvoice;
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
			return datacontext.invoice.getCount().then(function (data) {
				return vm.invoiceCount = data;
			});
		}

		function getInvoiceFilteredCount() {
			vm.invoiceFilteredCount = datacontext.invoice.getFilteredCount(vm.invoicesSearch);
		}

		function getInvoices(forceRefresh) {
			return datacontext.invoice.getAll(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.invoicesSearch).then(function (data) {
				vm.invoices = data;
				if (!vm.invoiceCount || forceRefresh) {
					getInvoiceCount();
				}
				getInvoiceFilteredCount();
				return data;
			});
		}

		function gotoInvoice(invoice) {
			if (invoice && invoice.id) {
				$location.path('/invoice/' + invoice.id);
			}
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