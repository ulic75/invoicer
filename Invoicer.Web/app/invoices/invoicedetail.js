(function () {
	'use strict';
	var controllerId = 'invoicedetail';
	angular.module('app').controller(controllerId, ['$routeParams', '$scope', '$window', 'common', 'config', 'datacontext', invoicedetail]);

	function invoicedetail($routeParams, $scope, $window, common, config, datacontext) {
		var vm = this;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		vm.cancel = cancel;
		vm.getTitle = getTitle;
		vm.invoice = undefined;
		vm.goBack = goBack;
		vm.hasChanges = false;
		vm.isSaving = false;
		vm.save = save;

		Object.defineProperty(vm, 'canSave', {
			get: canSave
		});
		function canSave() { return vm.hasChanges && !vm.isSaving; }

		activate();

		function activate() {
			onDestroy();
			onHasChanges();
			common.activateController([getInvoice()], controllerId)
                .then(function () {
                	log('Activated Invoice View');
                });
		}

		function cancel() {
			datacontext.cancel();
		}

		function getInvoice() {
			var id = $routeParams.id;
			return datacontext.invoice.getById(id).then(function (data) {
				vm.invoice = data;
			}), function (error) {
				logError('Unable to get invoice ' + id);
			}
		}

		function getTitle() {
			return 'Edit Invoice ' + ((vm.invoice && vm.invoice.id) || '');
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
			vm.isSaving = true;
			return datacontext.save().then(function (saveResult) {
				vm.isSaving = false;
			}, function (error) {
				vm.isSaving = false;
			});
		}
	}
})();