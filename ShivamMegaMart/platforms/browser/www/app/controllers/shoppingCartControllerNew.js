'use strict';
app.controller('shoppingCartController', ['$scope', 'localStorageService', '$rootScope', '$location', function ($scope, localStorageService, $rootScope, $location) {


    $scope.shoppingCart = [];

    $scope.RemoveCartGlobal = function (item)
    {
        $rootScope.$emit("DeleteFromCart", item);
        setTimeout(function () { $scope.GetCart(); }, 2000);
    }

    $scope.GetProductImageGlobal = function (Path)
    {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }

    $rootScope.$on("Getcart", function (event)
    {
        $scope.GetCart();
    });

    $scope.addTowishList = function (productID, product)
    {
        $rootScope.$emit("addTowishList", productID,product);
    }

    $scope.CalculateCartGlobal = function (cart) {
        $rootScope.$emit("CalculateCart", cart);
        $scope.TotalCartItems = _globalTotal;
        localStorage.setItem("GlobalTotal", _globalTotal);
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.UpdateQuantity = function (type, Index) {
        debugger;
        var _Objcopy = angular.copy($scope.shoppingCart[Index]);
        debugger;
        if (type == 1) {
            if (_Objcopy.Quantity == _Objcopy.ProductQuantity) {
                alert("Product Reached to its maximum limit");
            }
            else {
                _Objcopy.Quantity = _Objcopy.Quantity + 1;
            }

        }
        debugger;
        if (type == 2) {
            if (_Objcopy.Quantity > 1) {

                _Objcopy.Quantity = _Objcopy.Quantity - 1;
            }
        }
        $scope.shoppingCart[Index] = _Objcopy;
        CheckScopeBeforeApply();
        removeExistingItem('shoppingCarts');
        localStorage.setItem("shoppingCarts", JSON.stringify($scope.shoppingCart));
        $scope.GetCart();
    }


    $(document).on("keydown", ".qty", function (e) {
        if (!((e.keyCode > 95 && e.keyCode < 106)
          || (e.keyCode > 47 && e.keyCode < 58)
          || e.keyCode == 8)) {
            return false;
        }
    });

    $(document).on("focusout", ".qty", (function () {
        var _Value = parseFloat($(this).val());
        if ($.trim(_Value) == null || $.trim(_Value) == 'NaN' || $.trim(_Value) == 0 || $.trim(_Value) == '-' || $.trim(_Value) == '+' || $.trim(_Value) == '.') {
            $(this).val(1);
            $(this).trigger("input");
            $(this).trigger("change");
        }
        else {
            return true;
        }
    }));

    $scope.UpdateCartQuantity = function () {
        var allNewItems = [];
        for (var i = 0; i < $scope.shoppingCart.length; i++) {
            allNewItems.push($scope.shoppingCart[i]);
        }
        removeExistingItem('shoppingCarts');
        localStorage.setItem("shoppingCarts", JSON.stringify($scope.shoppingCart));
        $scope.GetCart();
    };

    function removeExistingItem(key) {
        if (localStorage.getItem(key) === null)
            return false;
        localStorage.removeItem(key);
        return true;
    }

    $scope.IsAutheticate = function ()
    {
        var authData = localStorageService.get('authorizationData');
        if (authData == null) {
            var url = $location.url();
            localStorage.setItem("currentUrl",JSON.stringify(url));
            $location.path("/login");
        }
        else
        {
            $location.path("/checkout");
        }      
    }

    $scope.SetProduct = function (product) {
        debugger;
 
        var _model = { displayLength: 1, displayStart: 0, searchText: '', filtertext: '', Categories: '', lowprice: '', highprice: '', isFeatured: "0", Productid: product.ProductId };
        $.ajax({
            url: serviceBase + 'api/Product/GetAllproduct',
            type: 'POST',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {
                debugger;
                $scope.products = data.aaData[0];
         
                localStorage.setItem("ProductDetail", JSON.stringify($scope.products));
                $location.path('/ProductDetail');
                $scope.$apply();
     
            }         
        });   
    }

    $scope.GetCart = function ()
    {
        var _localCartItems = localStorage.getItem("shoppingCarts");
        if (_localCartItems != null && _localCartItems != undefined) {
            $scope.shoppingCart = JSON.parse(_localCartItems);      
        }
        else {
            _localCartItems = [];
        }
        $scope.CalculateCartGlobal($scope.shoppingCart);
    }

    $('.btn-num-product-down').on('click', function (e) {
        debugger;
        e.preventDefault();
        $scope.Quantity = Number($(this).next().val());
        if ($scope.Quantity > 1) {
            $scope.Quantity = $scope.Quantity - 1;
            $(this).next().val($scope.Quantity);
        }

    });

    $('.btn-num-product-up').on('click', function (e) {
        debugger;
        e.preventDefault();
        $scope.Quantity = Number($(this).prev().val());
        $scope.Quantity = $scope.Quantity + 1;
        $(this).prev().val($scope.Quantity);
    });


    function init() {
        $scope.GetCart();
       
    }

    init();
}]);