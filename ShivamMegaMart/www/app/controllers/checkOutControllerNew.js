'use strict';
app.controller('checkOutController', ['$scope','$rootScope', '$location',  'localStorageService', 'authService', function ($scope,$rootScope, $location,localStorageService, authService) {
    $scope.authentication = authService.authentication;
    $scope.emailvalidation = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.ccinfo = { type: "fa fa-credit-card" }
    $scope.CurrentTab = 1;
    $scope.shipping = 0;
    $scope.CartTotal = 0;
    $scope.xyz = [];
    $scope.shoppingCartNew = [];

    $scope.ChangeTab = function (CurrentTab) {
        $scope.CurrentTab = CurrentTab;     
    }

    $scope.CustomerDetails = { FirstName: '', LastName: '', Phone: '', Email: '', Street: '', City: '', PinCode: '', State: '', Country: '', UserName: '', Password: '' };

    $scope.PaymentInformation = { cardType: '2', Nameoncard: '', ExpMonth: '', ExpYear:'', CardNumber: '', CVV: '' }
 
    $scope.PlaceOrder = function () {      
       var allDataToSend = { OrderCartItem: $scope.shoppingCartNew, CartTotal: $scope.CartTotal, OrderCustomerData: $scope.CustomerDetails, PaymentInfo: $scope.PaymentInformation };    
        $.ajax({
            url: serviceBase + 'api/CustomerOrders/PostOrder',
            type: 'POST',
            data: allDataToSend,
            dataType: 'json',
            success: function (data) {
                if (data.success == true) {
                    $rootScope.$emit("RemoveCart"); 
                    toastr.success("Success! Order placed successfully");                  
                    $location.path("/orders");
                    $scope.$apply();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("into error");
            }
        });

    };

    $scope.getpindata = function (pin)
    {
     
            var api = ' https://pincode.saratchandra.in/api/pincode/';
        $scope.Pin = pin;     
        $scope.Pincode = parseInt($scope.Pin);
        if (pin.length<6) {
            return false
        }
        else {       
            $.ajax({
                type:"Get",
                url: api + $scope.Pincode,
                //contentType: "application/json; charset=utf-8",
                dataType: "Json",
                success: function (data) {
                    console.log(data);
                }        
            })
        }
    
    }

    $scope.GetProductImageGlobal = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }

    $scope.getcustomerinfo = function ()
    {
        var authData = localStorageService.get('authorizationData');
        if (authData != null) {
            $.ajax({
                 url: serviceBase + 'api/CustomerWishlist/GetCustomerinfo',
                data: { UserName: authData.userName },
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    debugger;
                    if (data.success = true)
                    {

                        if (data.data[0].address.length == 0) {
                            $scope.CustomerDetails = {
                                FirstName: data.data[0].firstname,
                                LastName: data.data[0].lastname,
                                Phone: data.data[0].phone,
                                Email: data.data[0].email,
                                UserName: authData.userName,
                                Password: "abc12345",
                            }
                        }
                        else {
                            $scope.CustomerDetails = {
                                FirstName: data.data[0].firstname,
                                LastName: data.data[0].lastname,
                                Phone: data.data[0].phone,
                                Email: data.data[0].email,


                                City: data.data[0].address[0].city,
                                State: data.data[0].address[0].state,
                                PinCode: data.data[0].address[0].pincode,
                                Street: data.data[0].address[0].address,
                                UserName: authData.userName,
                                Password: "abc12345",
                            }
                        }
                       $scope.$apply();
                    }                  
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("error");
                }
            });
        }
        
    }

    $scope.getCartInfo = function ()
    {       
        $scope.shoppingCartNew = JSON.parse(localStorage.getItem("shoppingCarts"));
        console.log('checkout');
        console.log($scope.shoppingCartNew);
        $scope.CartTotal = localStorage.getItem("GlobalTotal");
    }

    //$scope.btnFinish = $('<button></button>').text('Finish')
    //                                      .addClass('btn btn-info')
    //                                      .on('click', function () { alert('Finish Clicked'); });
    //$scope.btnCancel = $('<button></button>').text('Cancel')
    //                                 .addClass('btn btn-danger')
    //                                 .on('click', function () { $('#smartwizard').smartWizard("reset"); });

 function createWizard ()
    {
        $('#smartwizard').smartWizard({
            selected: 0,
            theme: 'dots',
            transitionEffect: 'fade',
            showStepURLhash: false,

            toolbarSettings: {
                //toolbarPosition: 'single',
                //toolbarButtonPosition: 'end' ,
                //toolbarExtraButtons: [$scope.btnFinish, $scope.btnCancel]
            }
        });
    }

    function init()
    {
        createWizard();
        $scope.getCartInfo();
        $scope.getcustomerinfo();
      
    }

    init();
}]);

    app.directive
    ('creditCardType'
     ,function () {

     var directive =
       {
           require: 'ngModel'
       , link: function (scope, elm, attrs, ctrl) {
           ctrl.$parsers.unshift(function (value) {
               scope.ccinfo.type =
                 (/^5[1-5]/.test(value)) ? "fa fa-cc-mastercard"
                 : (/^4/.test(value)) ? "fa fa-cc-visa"
                 : (/^3[47]/.test(value)) ? 'fa fa-cc-amex'
                 : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'fa fa-cc-discover'
                 : undefined
               ctrl.$setValidity('invalid', !!scope.ccinfo.type)
               return value
           })
       }
       }
     return directive
 }
    )
