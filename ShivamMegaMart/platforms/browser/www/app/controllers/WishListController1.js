'use strict';
app.controller('WishListController1', ['$scope','$rootScope', '$location','localStorageService','authService', function ($scope,$rootScope, $location,localStorageService, authService) {
    $scope.authentication = authService.authentication;
    $scope.AllProductsColumns2 = [];
    $scope.count = 0;
    $scope.CurrentWishList = [];
    $scope.CurrentWishList.length;

    $scope.logOut = function () {
        $rootScope.$emit("logout");
    }
    $scope.DeletwishlistItem = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData != null) {
            $.ajax({
                url: serviceBase + 'api/WishlistDelete/DeleteWishListAll?UserID=' + authData.userName,
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    debugger;
                    if (data.success == true) {
                        toastr.success("Success! Wishlist Updated")
                        deferred.resolve(data);
                    }
                },
                error: function (data) {
                    alert("into error");
                    deferred.reject(err);
                },
            })
        }
    }
    $(document).on("click", "#autheticatuser", function () {
        debugger;
        $('.icon-action')
          .toggleClass('fa fa-chevron-right')
          .toggleClass('fa fa-chevron-down');
    });



    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }

    $scope.RemoveFromwishList = function (ID)
    {
        $rootScope.$emit("RemoveFromwishList", ID);
        setTimeout(function () { $scope.GetWishListfromService(); }, 2000);
    }

    $scope.SetProduct = function (product) {
        debugger;
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        $location.path('/ProductDetail');
    }
    $scope.AddToCartGlobal = function (productId, product, ID)
    {
        var _model = { displayLength: 1, displayStart:0, searchText:'', filtertext: '', Categories: '', lowprice:'', highprice:'', isFeatured: "0" ,Productid:productId};
         $.ajax({
            url: serviceBase + 'api/Product/GetAllproduct',
            type: 'POST',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {
                var colStartn = 0;
                for (var i = 0; i < data.aoColumns.length; i++) {

                    if (data.aoColumns[i] == 'CateogryID') {
                        if (colStartn == 0) {
                            colStartn = colStartn + 1;
                            continue;
                        }
                    }
                    else {
                        if (colStartn > 0) {
                            $scope.AllProductsColumns2.push({ ColName: data.aoColumns[i], colIndex: i });
                        } else {
                            continue;
                        }
                    }
                }           
                $scope.ProductData = data.aaData[0];
                $rootScope.$emit("AddToCart", productId, $scope.ProductData, ID, 1, $scope.AllProductsColumns2);
              }
            });
    }

    $scope.GetWishListfromService = function ()
    {
        authService.GetWishList().then(function (response)
        {
           $scope.CurrentWishList = response;
        },
         function (err) {
             $scope.message = err.error_description;
         });
    }

    function init()
    {
        $scope.GetWishListfromService();    
    }

    init();
   
}]);