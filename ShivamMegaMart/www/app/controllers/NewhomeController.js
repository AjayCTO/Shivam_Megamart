'use strict';
app.controller('NewhomeController', ['$scope', '$rootScope', 'localStorageService', '$location', function ($scope, $rootScope, localStorageService, $location) {

    $scope.CurrentType = 1;
    $scope.pagedItems = [];
    $scope.searchcategoriesslider = [];
    $scope.loadmostsale = false
    $scope.loadtop = false
    $scope.loadfeatured = false
    $scope.CurrentWishList = [];
    $scope.MostSaledItems = [];
    $scope.TopRatedItems = [];
    $scope.ProductDetail = {};
    function productSlider(className) {
        $(className).owlCarousel({
            loop: false,
            margin: 10,
            dots: false,
            nav: true,
            smartSpeed: 400,
            responsiveClass: true,
            navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
    };

    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }
   
    $scope.total = 0;


    $scope.GetcatBgImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/CategoryImage/" + Path;
        }
        return "../img/nocategory.png";
    }

    $scope.GetCategories = function () {
        //$scope.loadallcat = false;
        $.ajax({
            url: serviceBase + '/api/Categories/GetCategories',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                $scope.searchcategoriesslider = data;
               // localStorage.setItem("Categories", JSON.stringify(data));
                //$scope.loadallcat = true;
                $scope.$apply();
                productSlider(".hero-slider");
                
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.searchcategoriesslider = [];
            }
        });
    };

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.GetFeaturedProducts = function (event) {


        var _isFeatured = "";
        var _MostSale = "";
        var _topRated = "";
        var _displaylength = 0;
        var _ClassName = "";
        switch ($scope.CurrentType) {
            case 1:
                _isFeatured = "1";
                _topRated = "0";
                _MostSale = "0";
                _displaylength = 10;
                break;
            case 2:
                _MostSale = "1";
                _isFeatured = "0";
                _topRated = "0";
                _displaylength = 10;
                break;
            case 3:
                _topRated = "1";
                _MostSale = "0";
                _isFeatured = "0";
                _displaylength = 10;
                break;
            default:

        }

        var _model = { displayLength: _displaylength, displayStart: 0, searchText: "", filtertext: "", Categories: "", lowprice: "", highprice: "", isFeatured: _isFeatured, isMostSale: _MostSale, TopRated: _topRated };


        $.ajax({

            url: serviceBase + 'api/Product/GetAllproduct',
            type: 'POST',
            dataType: 'json',
            data: _model,
           // async:false,
            success: function (data, textStatus, xhr) {
                debugger;
                $scope.total = data.iTotalDisplayRecords;


                switch ($scope.CurrentType) {
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
                        break;
                }

               // CheckScopeBeforeApply();
                $scope.$apply();
                productSlider(_ClassName);
                alert("complete");
                
            },
            error: function (xhr, textStatus, errorThrown) {

                alert("error");
            }
        });


        return false;
    };

     
    $scope.GetCategories();
    $scope.GetFeaturedProducts();
   // $scope.CurrentType = 2;
    //$scope.GetFeaturedProducts();
    //$scope.CurrentType = 3;
    //$scope.GetFeaturedProducts();
    
    
}]);