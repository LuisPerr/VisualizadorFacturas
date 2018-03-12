// -- =============================================
// -- Author:      Vladimir Juárez
// -- Create date: 18/03/2016
// -- Description: Is the container of the application
// -- Modificó:
// -- Fecha:
// -- =============================================
var app = angular.module('app', ['ui.router', 'httpHelper', 'ngCookies'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $stateProvider
            .state('login', {
                url: '/',
                views: {
                    admin: {
                        templateUrl: '/angularJS/templates/login.html',
                        controller: 'loginController'
                    }
                }
            })
            .state('signup', {
                url: '/registro',
                views: {
                    admin: {
                        templateUrl: '/angularJS/templates/signup.html',
                        controller: 'signupController'
                    }
                }

            })
            .state('admin', {
                abstrac: true,
                admin: true,
                templateUrl: '/angularJS/templates/admin.html',
                controller: 'adminController',
                views: {
                    admin: {
                        templateUrl: '/angularJS/templates/admin.html',
                        controller: 'adminController',
                    },
                    fileUpload: {
                        templateUrl: '/angularJS/templates/fileUpload.html',
                        controller: 'fileUploadController'
                    },
                    fileUpdate: {
                        templateUrl: '/angularJS/templates/fileUpdate.html',
                        controller: 'fileUpdateController'
                    },
                    fileCheck: {
                        templateUrl: '/angularJS/templates/fileCheck.html',
                        controller: 'fileCheckController'
                    }, //LQMA add 06022018
                    fileLotePago: {
                        templateUrl: '/angularJS/templates/fileLotePago.html',
                        controller: 'fileLotePagoController'
                    }
                }
            })
            .state('admin.dashboard', {
                url: '/dashboard',
                admin: true,
                templateUrl: '/angularJS/templates/dashboard.html',
                controller: 'dashboardController'
            })
            .state('admin.news', {
                url: '/noticias',
                admin: true,
                templateUrl: '/angularJS/templates/news.html',
                controller: 'newsController'
            })
            .state('admin.detail', {
                url: "/noticias/{id:int}",
                admin: true,
                templateUrl: '/angularJS/templates/detailNew.html',
                controller: 'detailNewsController'
            })
            .state('admin.pOrder', {
                url: '/ordenes-pendientes',
                admin: true,
                templateUrl: '/angularJS/templates/pOrder.html',
                controller: 'pOrderController'
            })
            .state('admin.iPortal', {
                url: '/ordenes-ingresadas',
                admin: true,
                templateUrl: '/angularJS/templates/iPortal.html',
                controller: 'iPortalController'
            })
            .state('admin.oPaid', {
                url: '/ordenes-pagadas',
                admin: true,
                templateUrl: '/angularJS/templates/oPaid.html',
                controller: 'oPaidController'
            })
            .state('admin.account', {
                url: '/cuenta',
                admin: true,
                templateUrl: '/angularJS/templates/account.html',
                controller: 'userController'
            }).state('activatePending', {
                url: '/activacion-pendiente',
                admin: true,
                views: {
                    admin: {
                        templateUrl: '/angularJS/templates/activatePending.html',
                        controller: 'activatePendingController'
                    }
                }
            }).state('validating', {
                url: '/activacionCuenta',
                views: {
                    admin: {
                        templateUrl: '/angularJS/templates/validate.html',
                        controller: 'validateController'
                    }
                }
            })
        $urlRouterProvider.otherwise('/');
    });

app.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() {
            element.css('height', (w.height() - 20) + 'px');
        };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed
        });
        changeHeight(); // when page loads
    }
});
