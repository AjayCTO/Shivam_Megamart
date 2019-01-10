'use strict';
app.controller('loginController', ['$scope', '$rootScope', '$location', 'authService', 'ngAuthSettings', function ($scope, $rootScope, $location, authService, ngAuthSettings) {
    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };

    $scope.loading = false;
    $scope.message = "";
    $scope.isDisabled = false;

    $scope.login = function (ID) {
        debugger;
        $scope.isDisabled = true;
        $scope.loading = true;
    
        authService.login($scope.loginData).then(function (response) {
    
            //setTimeout(function () {
            //    $scope.isDisabled = false;
            //    $scope.loading = false;
           
            //}, 500);
            var _url = localStorage.getItem("currentUrl");
            if (_url != null && _url != undefined) {
                _url = JSON.parse(_url);
                $location.path(_url);
            }
            else {
                $location.path('/home');         
                swal({
                    title: response.userName,
                    text: "Successfully Login",
                    type:"success",
                    showConfirmButton:false,
                    timer: 1000
                })
                
            }
        },
         function (err) {           
             $scope.message = err.error_description;
         });
        setTimeout(function () {
            $scope.isDisabled = false;
            $scope.loading = false;
        }, 500);
      
    };

    $scope.authExternalProvider = function (provider)
    {
        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                   + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;
        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment)
    {
        $scope.$apply(function () {
            if (fragment.haslocalaccount == 'False') {
                authService.logOut();
                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };
                $location.path('/associate');
            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {                
                    $location.path('/home');
                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }

    $scope.signuploading = false;
    $scope.savedSuccessfully = false;
    $scope.isDisabledsignup = false;
    $scope.messages = "";
    $scope.registration = {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        userName: "",
        password: "",
        confirmPassword: ""

    };

    $scope.signUp = function () {
        debugger;
        $scope.signuploading = true;
        $scope.isDisabledsignup = true;
        authService.saveRegistration($scope.registration).then(function (response) {
            $scope.savedSuccessfully = true;  
            $scope.loginData = {
                userName: $scope.registration.userName,
                password:   $scope.registration.password,
                useRefreshTokens: false
            };
     
            $scope.login('login');
            //startTimer();
        },

         function (response) {
       
             var errors = [];
             for (var key in response.data.modelState) {
                 $scope.isDisabledsignup = false;
                 $scope.signuploading = false;
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }     
             $scope.messages = "Failed to register user due to:" + errors.join(' ');
 
         });
  
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }




}]);
