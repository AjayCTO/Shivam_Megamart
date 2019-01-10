'use strict';
app.controller('homeController', ['$scope', '$rootScope', 'localStorageService', '$location', function ($scope, $rootScope, localStorageService, $location)
{
    $scope.searchcategoriesslider = [];
    $scope.AllProductsColumns = [];
    $scope.pagedItems = [];
    $scope.MostSaledItems = [];
    $scope.TopRatedItems = [];
    $scope.searchcategories = [];
    $scope.total = 0;
    $scope.childmethod = function ()
    {
        $rootScope.$emit("GetCategories", {});
    }

    $scope.loadmostsale = false
    $scope.loadtop = false
    $scope.loadfeatured = false

    $scope.AddToCartGlobal = function (productID, product, ID)
    {
        $rootScope.$emit("AddToCart", productID, product, ID, 1, $scope.AllProductsColumns);
    }
     

    $scope.GoToProductsWithCategoryID = function (ID)
    {
        debugger
        localStorage.setItem("CategoryFilterID", ID);
        $location.path("/Product");
        $rootScope.$emit("CategoryID", ID);
    }

    $scope.GetCategories = function () {
        $.ajax({
            url: serviceBase + 'api/Categories/GetCategories',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                $scope.searchcategories = data; 
                $scope.$apply();
            },
            error: function (xhr, textStatus, errorThrown) { 
                $scope.searchcategories = [];
            }
        });
    };

    $scope.GetcatBgImage = function (Path)
    {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "CategoryImage/" + Path;
        }
        return "../img/nocategory.png";
    }

    $scope.SetProduct = function (product)
    {
        debugger;
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        localStorage.setItem("ProductAttribute", JSON.stringify($scope.AllProductsColumns));
        $location.path('/ProductDetail');
    }

    function productSlider(className) {
        $(className).owlCarousel({
            loop: true,
            margin: 10,
            dots: false,
           
            smartSpeed: 400,
            responsiveClass: true,
       
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4,
                    loop: false
                }
            }
        });
    }

    $scope.GetProductImage = function (Path) {
        if (Path!=undefined && $.trim(Path.split(',')[0]) != "") {
            return _GlobalImagePath + "ProductImages/" + Path.split(',')[0];
        }
        return "../img/no-image.png";
    }

    $scope.GetSupplierImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "SupplierImage/" + Path;
        }
        return "../img/no-image.png";
    }

    $scope.GetSuppliers = function () {
        $.ajax({
            url: serviceBase + 'api/Supplier/GetSuppliers',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) { 
                $scope.Suppliers = data;
                $scope.$apply();
                $('.brands-slider').owlCarousel({
                    loop: true,                 
                    dots: true,                      
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 4,
                            loop: false
                        }
                    }
                });


            },
            error: function (xhr, textStatus, errorThrown) {
     
            }
        });
    }


    $scope.GetFeaturedProducts = function (_Type) {  
            var _isFeatured = "";
            var _MostSale = "";
            var _topRated = "";
            var _displaylength = 10;
            var _ClassName = "";
            switch (_Type) {
                case 1:
                    _isFeatured = "1";
                    _displaylength = 5;
                    break;
                case 2:
                    _MostSale = "1";
                    _displaylength = 5;
                    break;
                case 3:
                    _topRated = "1";
                    _displaylength = 5;
                    break;
                default:

            }
            var _model = { displayLength: _displaylength, displayStart: 0, searchText: "", filtertext: "", Categories: "", lowprice: "", highprice: "", isFeatured: _isFeatured, isMostSale: _MostSale, TopRated: _topRated };
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
                                $scope.AllProductsColumns.push({ ColName: data.aoColumns[i], colIndex: i });
                            } else {
                                continue;
                            }
                        }
                    }

                    $scope.total = data.iTotalDisplayRecords;


                    switch (_Type) {
                        case 1:
                            $scope.pagedItems = data.aaData;
                            _ClassName = '.products-slider';
                            break;
                        case 2:
                            $scope.MostSaledItems = data.aaData;
                            _ClassName = '.mostsaled-slider';

                            break;
                        case 3:
                            $scope.TopRatedItems = data.aaData;
                            _ClassName = '.topRated-slider';

                            break;
                        default:

                    }

                    $scope.loadmostsale = true
                    $scope.loadtop = true
                    $scope.loadfeatured = true
                    $scope.$apply();
                    productSlider(_ClassName);
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("Error");
                }
            });
        
        
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    function init() {     
        $scope.GetCategories();
        $scope.GetFeaturedProducts(1);
        $scope.GetFeaturedProducts(2);
        $scope.GetFeaturedProducts(3);
        $scope.GetSuppliers();
      }



    init();
}]);