﻿(function () {
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
			registerInvoice(metadataStore);
		}

		//#region Internal Methods

		function registerInvoice(metadataStore) {
			metadataStore.registerEntityTypeCtor('Invoice', Invoice);

			function Invoice() {
				this.stringId = "";
			}

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

		//#endregion
	}
})();