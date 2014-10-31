(function () {
	'use strict';
	var serviceId = 'model';
	angular.module('app').factory(serviceId, [model]);

	function model() {
		var entityNames = {
			client: 'Client',
			lineitemdescription: 'LineItemDescription',
			invoice: 'Invoice',
			payment: 'Payment',
			lineitem: 'LineItem'
		}

		var service = {
			configureMetadataStore: configureMetadataStore,
			entityNames: entityNames
		}

		return service;

		function configureMetadataStore(metadataStore) {
			// This is an example call which calls the example functions below
			// to extend the data via computeds and local only data
			registerInvoice(metadataStore);
		}

		//#region Internal Methods

		function registerInvoice(metadataStore) {
			metadataStore.registerEntityTypeCtor('Invoice', Invoice);

			function Invoice() {
				this.stringId = 0;
			}

			//Object.defineProperty(Invoice.prototype, 'stringId', {
			//	get: function () {
			//		var id = this.id;
			//		var value = id.toString();
			//		return value;
			//	}
			//})
		}

		//#endregion
	}
})();