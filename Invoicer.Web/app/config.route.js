(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
        	setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });

        function setRoute(url, definition) {
        	// Sets resolvers for all the routes
			// by extending existing resolvers (or creating a new one)
        	definition.resolve = angular.extend(definition.resolve || {}, {
        		prime: prime
        	});
        	$routeProvider.when(url, definition);
        	return $routeProvider;
		}
    }

    prime.$inject = ['datacontext'];
    function prime(datacontext) {
    	return datacontext.prime();
	}

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }, {
            	url: '/clients',
            	config: {
            		title: 'clients',
            		templateUrl: 'app/clients/clients.html',
            		settings: {
            			nav: 2,
            			content: '<i class="fa fa-user"></i> Clients'
            		}
            	}
            }, {
            	url: '/client/:id',
            	config: {
            		title: 'client',
            		templateUrl: 'app/clients/clientdetail.html',
            		settings: { }
            	}
            }, {
            	url: '/invoices',
            	config: {
            		title: 'invoices',
            		templateUrl: 'app/invoices/invoices.html',
            		settings: {
            			nav: 2,
            			content: '<i class="fa fa-file"></i> Invoices'
            		}
            	}
            }, {
            	url: '/invoice/:id',
            	config: {
            		title: 'invoices',
            		templateUrl: 'app/invoices/invoicedetail.html',
            		settings: { }
            	}
            }, {
            	url: '/invoices/search/:id',
            	config: {
            		title: 'invoices-search',
            		templateUrl: 'app/invoices/invoices.html',
            		settings: {}
				}
            }, {
            	url: '/admin',
            	config: {
            		title: 'admin',
            		templateUrl: 'app/admin/admin.html',
            		settings: {
            			nav: 3,
            			content: '<i class="fa fa-lock"></i> Admin'
            		}
            	}
            }
        ];
    }
})();