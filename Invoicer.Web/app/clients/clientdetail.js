(function () {
	'use strict';
	var controllerId = 'clientdetail';
	angular.module('app').controller(controllerId, ['$routeParams', '$scope', '$window', 'common', 'config', 'datacontext', clientdetail]);

	function clientdetail($routeParams, $scope, $window, common, config, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);
		var logError = getLogFn(controllerId, 'error');

		vm.cancel = cancel;
		vm.client = undefined;
		vm.getTitle = getTitle;
		vm.goBack = goBack;
		vm.hasChanges = false;
		vm.isSaving = false;
		vm.save = save;

		Object.defineProperty(vm, 'canSave', { get: canSave	});
		
		activate();

		function activate() {
			onDestroy();
			onHasChanges();
			common.activateController([getClientDetail()], controllerId)
                .then(function () { log('Activated Client Detail View'); });
		}

		function cancel() {	datacontext.cancel(); }

		function canSave() { return vm.hasChanges && !vm.isSaving; }

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

		function goBack() { $window.history.back(); }
		
		function onDestroy() {
			$scope.$on('$destroy', function () {
				datacontext.cancel();
			})
		}

		function onHasChanges() {
			$scope.$on(config.events.hasChangesChanged, function (event, data) {
				vm.hasChanges = data.hasChanges;
			});
		}

		function save() {
			if (!canSave()) { return $q.when(null); }
			vm.isSaving = true;
			return datacontext.save().then(function (saveResult) {
				vm.isSaving = false;
			}, function (error) {
				vm.isSaving = false;
			});
		}
	}
})();