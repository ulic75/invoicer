(function () {
	'use strict';
	var controllerId = 'clientdetail';
	angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', clientdetail]);

	function clientdetail($routeParams, common, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, 'error');

		vm.client = undefined;
		vm.getTitle = getTitle;

		activate();

		function activate() {
			common.activateController([getClientDetail()], controllerId)
                .then(function () { log('Activated Client Detail View'); });
		}

		function getClientDetail() {
			var id = $routeParams.id;
			return datacontext.client.getById(id).then(function (data) {
				vm.client = data;
			}), function (error) {
				logError('Unable to get client ' + id);
			}
		}

		function getTitle() {
			return 'Edit ' + ((vm.client && vm.client.name) || '');
		}
	}
})();