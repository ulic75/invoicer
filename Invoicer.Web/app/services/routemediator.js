(function () {
	'use strict';
	var serviceId = 'routemediator';
	angular.module('app').factory(serviceId, ['$location', '$rootScope', 'config', 'logger', routemediator]);

	function routemediator($location, $rootScope, config, logger) {
		var handlingRouteChangeError = false;

		var service = {
			setRoutingHandlers: setRoutingHandlers,
		}

		return service;

		function setRoutingHandlers() {
			updateDocTitle();
			handleRoutingErrors();
		}

		//#region Internal Methods

		function handleRoutingErrors() {
			$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
				if (handlingRouteChangeError) { return; }
				handlingRouteChangeError = true;
				var msg = 'Error routing: ' + (current && current.name) + '. ' + (rejection.msg || '');
				logger.logWarning(msg, current, serviceId, true);
				$location.path('/');
			});
		}

		function updateDocTitle() {
			$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
				handlingRouteChangeError = false;
				var title = config.docTitle + (current.title || '');
				$rootScope.title = title;
			});
		}

		//#endregion
	}
})();