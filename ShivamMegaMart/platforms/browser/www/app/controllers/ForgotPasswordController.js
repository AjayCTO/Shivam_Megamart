'use strict';
app.controller('ForgotPasswordController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    //$scope.emailvalidation = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.custEmail = "";
   
    $scope.submitEmail = function () {
      
        $.ajax({
            url: serviceBase + 'api/CustomerOrders/ForgotPassword?email=' +$scope.custEmail,
            type: 'GET',
            dataType: 'json',
            
            success: function (data) {
                debugger;
                if (data.success == true) {
                    $scope.contactdetails = {
                        name: "",
                        EmailAddress: "",
                        message: ""
                    };
                    toastr.success("Sucessfully Send");
                    $scope.$apply();
                }
            },
            error: function (data) {
                debugger;
                if (data.success == false) {
                    alert("in error");
                }
            }
        });
    };

}]);