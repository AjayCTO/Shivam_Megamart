'use strict';
app.controller('OrderItemBillingController', ['$scope', '$rootScope', 'localStorageService', '$location', function ($scope, $rootScope, localStorageService, $location) {

    $scope.productdiscription = [];
    $scope.localorderitem = [];
    $scope.Customerdetails = [];

    var _localorderitem = localStorage.getItem("orderitem");

    var Customerdetails = localStorage.getItem("Customerdetails");
    if (_localorderitem != null && _localorderitem != undefined)
    {
        $scope.localorderitem = JSON.parse(_localorderitem);
        console.log($scope.localorderitem);
    }
    else {
        $scope.localorderitem = [];
    }

    if (Customerdetails != null && Customerdetails != undefined)
    {
        $scope.Customerdetails = JSON.parse(Customerdetails);
        console.log($scope.Customerdetails);
    }
    else {
        $scope.Customerdetails = [];
    }

    $scope.OrderItem = [];

    $scope.getorderitem = function () {
      
        $.ajax({
            url: serviceBase + '/api/CustomerOrders/GetOrderItem?orderID=' + $scope.localorderitem.id,
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                    $scope.productdiscription=data;                    
                    $scope.$apply();
                }         
        });
    }

    function init() {     
        $scope.getorderitem();
    }

    init();
}]);