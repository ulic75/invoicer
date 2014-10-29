(function () {
	'use strict';
	var serviceId = 'model';
	angular.module('app').factory(serviceId, [model]);

	function model() {
		var service = {
			configureMetadataStore: configureMetadataStore
		}

		return service;

		function configureMetadataStore(metadataStore) {
			registerLineItemDescription(metadataStore);
			registerClient(metadataStore);
		}

		//#region Internal Methods

		function registerClient(metadataStore) {
			metadataStore.registerEntityTypeCtor('Client', Client);

			function Client() { }

			Object.defineProperty(Client.prototype, 'fullName', {
				get: function () {
					var name = this.name;
					var value = name + ' (blah)';
					return value;
				}
			})
		}

		function registerLineItemDescription(metadataStore) {
			metadataStore.registerEntityTypeCtor('LineItemDescription', LineItemDescription);

			function LineItemDescription() { }

			Object.defineProperty(LineItemDescription.prototype, 'name', {
				get: function () {
					var description = this.description;
					var value = description + ' (blah)';
					return value;
				}
			})
		}

		//#endregion
	}
})();