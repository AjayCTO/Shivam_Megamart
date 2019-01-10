'use strict';
app.controller('indexController', ['$scope','$route', '$rootScope', 'localStorageService', '$location', 'authService', function ($scope,$route, $rootScope, localStorageService, $location, authService) {


    $scope.$on('$routeChangeStart', function ($event, next, current) {
        $(".wrap-side-menu").removeClass("show2").addClass("hideM");
        $("body").scrollTop();
    });


    $scope.searchcategories = [];
    $scope.CurrentCartList = [];
    $scope.CurrentWishList = [];
    $scope.shoppingCartDefault;
    $scope.CartProductsCounter = 0;
    $scope.AllCartItems = [];

    var _localCategories = localStorage.getItem("Categories");
    if (_localCategories != null && _localCategories != undefined) {
        _localCategories = JSON.parse(_localCategories);

    }
    else {
        _localCategories = [];
    }
    $scope.shoppingCart = [];
    $scope.TotalOfCartItems = 0;

    var _localCartItems = localStorage.getItem("shoppingCart");
    if (_localCartItems != null && _localCartItems != undefined) {
        _localCartItems = JSON.parse(_localCartItems);

    }
    else {
        _localCartItems = [];
    }


    $rootScope.$on("logout", function (event) {

        $scope.logOut();
    });
    $scope.logOut = function () {
        debugger;
        localStorage.removeItem("currentUrl");

        localStorage.removeItem("shoppingCarts");
        $scope.GetCart();
        authService.logOut();
        $location.path('/home');
    }

    $rootScope.$on("AddToCart", function (event, productId, product, ID, cartQuantity, cols) {
        $scope.AddToCart(productId, product, ID, cartQuantity, cols);
    });

    $rootScope.$on("addTowishList", function (event, productId,product,ID) {
        $scope.addTowishList(productId,product,ID);
    });

    $rootScope.$on("DeleteFromCart", function (event, product) {
        $scope.DeleteFromCart(product);
    });

    $rootScope.$on("RemoveFromwishList", function (event, ID) {
        $scope.RemoveFromwishList(ID);
    });

    $rootScope.$on("CalculateCart", function (event, cart) {
        CalculateTotal(cart);
    });

    $rootScope.$on("RemoveCart", function (event) {
        $scope.removeCart();
    });

 
    $scope.GetCategories = function () {
        $scope.loadallcat = false;
        $.ajax({
            url: serviceBase + '/api/Categories/GetCategories',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                $scope.searchcategories = data;
                console.log("Category");
                console.log($scope.searchcategories);
                localStorage.setItem("Categories", JSON.stringify(data));


                $scope.loadallcat = true;
                $scope.$apply();
              //  $('.dropdown-menu').dropdown();

            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.categories = [];
            }
        });
    };

    $scope.LoadChildren = function (e) {
        debugger
        var $el = $(this);
        var $parent = $(this).offsetParent(".dropdown-menu");
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');

        $(this).parent("li").toggleClass('show');

        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-menu .show').removeClass("show");
        });

        if (!$parent.parent().hasClass('navbar-nav')) {
            $el.next().css({ "top": $el[0].offsetTop, "left": $parent.outerWidth() - 4 });
        }

        return false;
    }

    $scope.CustomerOrders = [];

    $scope.GetOrder = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData != null) {
            $.ajax({
                url: serviceBase + '/api/CustomerOrders/GetOrder?UserName=' + authData.userName,
                type: 'GET',
                dataType: 'json',
                success: function (data, textStatus, xhr) {
                    if (data.success == true) {
                        $scope.CustomerOrders = data.data;
                        localStorage.setItem("Customerorders", JSON.stringify($scope.CustomerOrders));
                        CheckScopeBeforeApply();
                        $location.path("/orders");
                    }

                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("GetOrder error");
                }
            });
        }
    }

    $scope.removeCart = function () {
        localStorage.removeItem("shoppingCarts");
        $scope.GetCart();
    }

    $scope.GetCart = function () {
        $rootScope.$emit("Getcart");
        var _localCartItems = localStorage.getItem("shoppingCarts");
        if (_localCartItems != null && _localCartItems != undefined) {
            $scope.shoppingCart = JSON.parse(_localCartItems);
        }
        else {
            _localCartItems = [];
        }
        CalculateTotal($scope.shoppingCart);
    }




    $scope.GoToProductsWithCategoryID = function (ID,Name) {
        debugger;
        var url = $location.url();
        if (url == "/Product") {
            $rootScope.$emit("CategoryID", ID, Name);
        }
        else {
            localStorage.setItem("CategoryFilterID", ID);
            $location.path("/Product");
            $rootScope.$emit("CategoryID", ID, Name);
        }
      
    }

    $scope.GetProductImageGlobal = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }

    $scope.RemoveFromwishList = function (ID) {
        authService.RemoveFromwishList(ID).then(function (response) {
            $scope.GetWishListfromService();
        },
         function (err) {
             $scope.message = err.error_description;
         });
    }


    $scope.DeleteFromCart = function (Product) {
     
        bootbox.confirm("Are you sure you want to delete this item from cart ?", function (result) {
            if (result) {
                var _localCartItems = localStorage.getItem("shoppingCarts");
                if (_localCartItems != null && _localCartItems != undefined) {
                    var allItems = JSON.parse(_localCartItems);
                    var allNewItems = [];
                    for (var i = 0; i < allItems.length; i++) {

                        if (allItems[i].ProductId != Product.ProductId) {
                            allNewItems.push(allItems[i]);
                        }
                    }
                    removeExistingItem('shoppingCarts');
                    localStorage.setItem("shoppingCarts", JSON.stringify(allNewItems));
                    $scope.GetCart();
                }
                else {
                    _localCartItems = [];
                }
            }
        });
    };

    function CalculateTotal(cart) {
        var _localCartItems = localStorage.getItem("shoppingCarts");
        if (_localCartItems != null && _localCartItems != undefined) {
            $scope.shoppingCart = JSON.parse(_localCartItems);
        }
        else {
            $scope.shoppingCart = [];
        }
        var total = 0;

        for (var i = 0; i < $scope.shoppingCart.length; i++) {
            var product = $scope.shoppingCart[i];
            total += (product.Cost * (product.Quantity == null || product.Quantity == undefined ? 1 : product.Quantity));
        }
        $scope.TotalOfCartItems = total;
        _globalTotal = total;
        $scope.CartProductsCounter = $scope.shoppingCart.length;
        CheckScopeBeforeApply();
    }
    if (_localCategories.length == 0) {
        $scope.GetCategories();
    }
    else {
        $scope.searchcategories = _localCategories;
    }
    $scope.authentication = authService.authentication;

    function Animate2Item(originalID) {
        $(originalID).animate_from_to('.cart', {
            pixels_per_second: 700,
            initial_css: {
                'background': 'rgb(214, 209, 216,0.5)',
                'border-radius': '100%'
            }
        });

    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.GetWishListfromService = function () {
        authService.GetWishList().then(function (response) {
            $scope.CurrentWishList = response;
        },
         function (err) {
             $scope.message = err.error_description;
         });
    }

    $scope.search = "";
    $scope.Goblesearch = function (search) {
        debugger;
        isGlobalSearchActive = true;
        globalSearchstring = search;
        var url = $location.url();
        if (url == "/Product")
        {
            $route.reload();
        }
        else {
            $location.path("/Product");
            }
    }

    $scope.CheckisInWishList = function (ProductID)
    {
        for (var i = 0; i < $scope.CurrentWishList.length; i++) {
            if ($scope.CurrentWishList[i].productattrId == ProductID) {
                return "active";
            }
        }
        return "";
    }

    $scope.addTowishList = function (productId,product,ID)
    {
        debugger;
      var authData = localStorageService.get('authorizationData');
        if (authData == null) {
            var url = $location.url();
            localStorage.setItem("currentUrl", JSON.stringify(url));
            $location.path("/login");
        }
        else {

            if ($scope.CheckisInWishList(productId) == "active") {
                debugger;
                for (var i = 0; i < $scope.CurrentWishList.length; i++) {
                    if ($scope.CurrentWishList[i].productattrId == productId) {
                        toastr.warning("Already added in you wishlist");
                        break;
                    }
                }
            }
            else {

                var wishListmodel = { ProductId: productId, Productattrid: productId, CustomerId: -1, UserID: authData.userName };
                $.ajax({
                    url: serviceBase + 'api/CustomerWishlist/PostWishList',
                    type: 'POST',
                    data: wishListmodel,
                    dataType: 'json',
                    success: function (data) {
                        if (data.success == true) {
                            $scope.iconclass = "angel icon-heart";
                            swal(product.ProductName, "is added to Wishlist !", "success");
                            $scope.GetWishListfromService();
                            if (ID==undefined) {
                                $scope.DeleteFromCart(product);
                            }
                            $scope.$apply();
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                    }
                });
            }
        }

    };

    $scope.CheckisInCart = function (ProductID)
    {
        for (var i = 0; i < $scope.CurrentCartList.length; i++) {
            if ($scope.CurrentCartList[i].productattrId == ProductID) {

                return "active";
            }
        }
        return "";
    }

    $scope.AddToCart = function (productId, product, ID, cartQuantity, cols)
    {
        debugger;
        if (product[3] !== 0) {
            $scope.AllCartItems = localStorage.getItem("shoppingCarts") === null ? [] : JSON.parse(localStorage.getItem("shoppingCarts"));
            var item = $scope.AllCartItems.filter(function (item) {
                if (product.allAttributes == undefined) {
                    if (item.ProductId === product[4]) {
                        item.Quantity = item.Quantity + 1;
                    }
                }
                else {
                    if (item.ProductId === product.ProductId) {
                        item.Quantity = item.Quantity + 1;
                    }
                }
                return product.allAttributes == undefined ? item.ProductId === product[4] : item.ProductId === product.ProductId;
            })[0];
            if (item == undefined) {
                $scope.CartProductsCounter++;
                var des = "";
                var k = 15;
                if (product.allAttributes == undefined) {
                    for (var i = 0; i < cols.length; i++) {

                        if (product[k] == null || product[k] == "-") {
                            k = k + 1;
                        }
                        else {
                            des = des + "<strong>" + cols[i].ColName + "</strong> : " + "(" + product[k].toUpperCase() + ") ";
                            k = k + 1;
                        }
                    }
                    cartQuantity = cartQuantity == undefined || cartQuantity == null ? 1 : cartQuantity;
                    $scope.AllCartItems.push({ ProductId: product[4], Image: product[13].split(',')[0], Quantity: cartQuantity, ProductName: product[9], productDescription: product[10], ProductQuantity: product[3], PID: product[8], Cost: product[5], discount: 0, SupplierID: product[7], ProductcartDescription: des });
                } else {
                    for (var i = 0; i < product.allAttributes.length; i++) {

                        if (product.allAttributes[i].attrvalue == null || product.allAttributes[i].attrvalue == "-") {
                            continue;
                        }
                        else {
                            des = des + "<strong>" + product.allAttributes[i].attrName + "</strong> : " + "(" + product.allAttributes[i].attrvalue.toUpperCase() + ") ";
                            k = k + 1;
                        }
                    }
                    cartQuantity = cartQuantity == undefined || cartQuantity == null ? 1 : cartQuantity;
                    $scope.AllCartItems.push({ ProductId: product.ProductId, Image: product.Images[0].imagepath, Quantity: cartQuantity, ProductName: product.ProductName, productDescription: product.Productd, PID: product.PID, ProductQuantity: product.ProductQuantity, Cost: product.ProductCost, discount: 0, SupplierID: product[7], ProductcartDescription: des });
                }

            }
            debugger;
            if (product[9] == undefined) {

                product[9] = product.ProductName;
            }
            swal(product[9], "is added to Cart !", "success");     
            localStorage.setItem("shoppingCarts", JSON.stringify($scope.AllCartItems));
           
        }
        else {
            toastr.error("You can't Add this Item becasue it is Not Available in Stock");
         }

    };

    function removeExistingItem(key) {
        if (localStorage.getItem(key) === null)
            return false;
        localStorage.removeItem(key);
        return true;
    }

    function init()
    {
        $scope.GetCategories();
        $scope.GetCart();
        var authData = localStorageService.get('authorizationData');
        if (authData != null) {
            $scope.GetWishListfromService();
        }
    }

    init();

}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});