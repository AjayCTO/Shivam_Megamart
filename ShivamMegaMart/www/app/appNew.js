
var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'ngSanitize', 'ui.bootstrap', 'ui.utils']);

app.config(function ($routeProvider) {
   


    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/homeNew.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/loginNew.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html"
    });

    $routeProvider.when("/Merchant", {
        controller: "MerchantController",
        templateUrl: "/app/views/Merchant.html"
    });
    $routeProvider.when("/Billing", {
        controller: "OrderItemBillingController",
        templateUrl: "/app/views/OrderItemBilling.html"
    });
    $routeProvider.when("/Employee", {
        controller: "EmployeeController",
        templateUrl: "/app/views/Employee.html"
    });
    $routeProvider.when("/Customer", {
        controller: "CustomerController",
        templateUrl: "/app/views/Customer.html"
    });
    $routeProvider.when("/Service", {
        controller: "ServiceController",
        templateUrl: "/app/views/Service.html"
    });
    $routeProvider.when("/Task", {
        controller: "TaskController",
        templateUrl: "/app/views/Task.html"
    });

    $routeProvider.when("/MerchantList", {
        controller: "MerchantListController",
        templateUrl: "/app/views/MerchantList.html"
    });

    $routeProvider.when("/Product", {
        controller: "productController",
        templateUrl: "/app/views/productNew.html"
    });

    $routeProvider.when("/ShoppingCart", {
        controller: "shoppingCartController",
        templateUrl: "/app/views/shoppingCartNew.html"
    });

    $routeProvider.when("/checkout", {
        controller: "checkOutController",
        templateUrl: "/app/views/checkOutNew.html"
    });    

    $routeProvider.when("/Contact", {
        controller: "contactController",
        templateUrl: "/app/views/Contactus.html"
    });
    $routeProvider.when("/ProductDetail", {
        controller: "ProductDetailController",
        templateUrl: "/app/views/ProductDetailsNew.html"
    });
    $routeProvider.when("/WishList", {
        controller: "WishListController1",
        templateUrl: "/app/views/Customerwishlist.html"
    });

    $routeProvider.when("/ForgotPassword", {
        controller: "ForgotPasswordController",
        templateUrl: "/app/views/ForgotPassword.html"
    });


    $routeProvider.otherwise({ redirectTo: "/home" });

});

//var serviceBase = 'http://localhost:26264/';
//var _GlobalImagePath = "http://localhost:7080/";

var serviceBase = 'http://shivamface.shivamitconsultancy.com/';
var _GlobalImagePath = "http://shivamonline.shivamitconsultancy.com/";

//var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

(function (app) {

    var routeLoadingIndicator = function ($rootScope) {
        return {
            restrict: 'E',
            template: "<div class='col-lg-12' ng-if='isRouteLoading' style='color: orange;text-align: center; margin-top: 175px; margin-bottom: 60px  '><h1>Loading <i class='fa fa-cog fa-spin'></i></h1></div>",
            link: function (scope, elem, attrs) {
                scope.isRouteLoading = false;

                $rootScope.$on('$routeChangeStart', function () {
                  
                    scope.isRouteLoading = true;
                });

                $rootScope.$on('$routeChangeSuccess', function () {
             
                    scope.isRouteLoading = false;
                });
            }
        };
    };
    routeLoadingIndicator.$inject = ['$rootScope'];
    app.directive('routeLoadingIndicator', routeLoadingIndicator);
}(angular.module('AngularAuthApp')));


