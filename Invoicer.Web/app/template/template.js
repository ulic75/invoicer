(function () {
	'use strict';
	var controllerId = 'TEMPLATE';
	angular.module('app').controller(controllerId, ['common', TEMPLATE]);

	function TEMPLATE(common) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.title = 'TEMPLATE';

		activate();

		function activate() {
			common.activateController([getSomething()], controllerId)
                .then(function () { log('Activated TEMPLATE View'); });
		}

		function getSomething() {

		}

	}
})();