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
			// Extend the data
			registerClient(metadataStore);
			registerInvoice(metadataStore);
			registerLineItem(metadataStore);
		}

		//#region Internal Methods

		function registerClient(metadataStore) {
			metadataStore.registerEntityTypeCtor('Client', Client);

			function Client() {
				this.isPartial = false;
			}
		}

		function registerInvoice(metadataStore) {
			metadataStore.registerEntityTypeCtor('Invoice', Invoice);

			function Invoice() {
				this.stringId = "";
			}

			Object.defineProperty(Invoice.prototype, 'formattedDate', {
				get: function () {
					var value = moment(this.date).utc().format('MM/DD/YYYY');
					return value;
				}
			});

			Object.defineProperty(Invoice.prototype, 'total', {
				get: function () {
					var value = 0;
					this.lineItems.forEach(function (lineItem) {
						value += (lineItem.quantity * lineItem.unitPrice);
					});
					return value;
				}
			});

			Object.defineProperty(Invoice.prototype, 'totalPayments', {
				get: function () {
					var value = 0;
					this.payments.forEach(function (payment) {
						value += (payment.amount);
					});
					return value;
				}
			});

		}

		function registerLineItem(metadataStore) {
			metadataStore.registerEntityTypeCtor('LineItem', LineItem);

			function LineItem() {
			}

			Object.defineProperty(LineItem.prototype, 'total', {
				get: function () {
					var value = this.unitPrice * this.quantity;
					return value;
				}
			});
		}

		//#endregion
	}
})();