﻿'use strict';
app.controller('productController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    $scope.AllAttributeFilters = [];
    $scope.Attributes = [];
    $scope.AttributesValue = [];
    $scope.AttributesAllValue = [];
    $scope.pagedItems = [];
    $scope.total = 0;
    $scope.itemsPerPage = 10;
    $scope.active = '';
    $scope.currentPage = 0;
    $scope.startpage = 0;
    $scope.items = [];
    $scope.valuess = [];
    $scope.search = '';
    $scope.selectedAttribute = "";
    $scope.categoriesobj = '';
    $scope.TotalItems = 0;
    $scope.attrlenght = $scope.AttributesValue.length;
    $scope.categoriesarraySelect = [];
    $scope.attrarraySelect = [];
    $scope.categories = [];
    $scope.Minval = '';
    $scope.Maxval = '';
    $scope.AllProductsColumns = [];

    var _IsLazyLoading = 0;
    var _IsLazyLoadingUnderProgress = 0;
    var _TotalRecordsCurrent = 0;

    $scope.loadallproducts = false;



    $scope.getProductDetail = function (_Product) {
        debugger;
        $scope.ProductDetail = _Product;
        CheckScopeBeforeApply();
        $("#exampleModal").modal("show");
    }

    //$rootScope.$on("GetAttriubte", function () {
    //    $scope.getAllattribute();
    //});
    $scope.AddToCartGlobal = function (productID, product, ID) {
        $rootScope.$emit("AddToCart", productID, product, ID);
    }
    $rootScope.$on("GoToProductsWithCategory", function (event, ID) {
        debugger;
        $location.path("/Product");
        $scope.AddCatArray(ID);
       
    });
    $rootScope.$on("GoToProductsWithSearch", function (event, search) {
        debugger;
        $scope.search = search;
        $scope.GetProducts();

    });


    $scope.childmethod = function () {
        $rootScope.$emit("GetCategories", {});
    }
    var _localCategories = localStorage.getItem("Categories");


    //var _localCatID = localStorage.getItem("filterCategoryID");


    //setTimeout(function () {
    //    $("#name" + _localCatID).trigger('click');
    //},500)

    

    if (_localCategories != null && _localCategories != undefined) {

        _localCategories = JSON.parse(_localCategories);

    }
    else {
        $scope.childmethod();
        _localCategories = localStorage.getItem("Categories")
        _localCategories = JSON.parse(_localCategories);

    }
    $scope.categories = _localCategories;

    //if (_localCatID != null && _localCatID != undefined) {
    //    $scope.categoriesobj = _localCatID;
    //}


    var _localAttributevalue = localStorage.getItem("GetAttributesAllValue");
    $scope.AttributesAllValue = JSON.parse(_localAttributevalue);
    //Get Product 
    function init() {
        $scope.GetProducts();
        //$scope.getAllattribute();
   
    }


    $scope.SetProduct = function (product) {
        debugger;
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        $location.path('/ProductDetail');
    }




    $scope.GetProducts = function () {
       
        $scope.loadallproducts = false;
        _IsLazyLoadingUnderProgress = 1;
        $scope.totalrecord = 1;
        var FilterText = "";
        var newcounter = 0;
        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Values.length > 0) {
                if (newcounter == 0) {
                    FilterText = FilterText + "(";
                    newcounter++;
                }
                FilterText = FilterText + " [" + $scope.AllAttributeFilters[i].Name + "]  in (";
                for (var k = 0; k < $scope.AllAttributeFilters[i].Values.length; k++) {
                    FilterText = FilterText + "'" + $scope.AllAttributeFilters[i].Values[k] + "'" + ",";
                }
                FilterText = FilterText.replace(/,\s*$/, "");

                FilterText = FilterText + ") AND ";


            }
        }
        if (newcounter > 0) {
            FilterText = FilterText.substring(0, FilterText.length - 4);
            FilterText = FilterText + ") AND";
        }

        if ($.trim($scope.categoriesobj) != "" || $.trim(FilterText) != "" || $.trim($scope.Minval) != "" || $.trim($scope.Maxval) != "" || $.trim($scope.search) != "") {
            $scope.startpage = 0;
            $scope.pagedItems = [];
        }

        if(isGlobalSearchActive == true)
        {
            $scope.search = globalSearchstring;
             
        }
        

        var _model = { displayLength: $scope.itemsPerPage, displayStart: $scope.startpage, searchText: $scope.search, filtertext: FilterText, Categories: $scope.categoriesobj, lowprice: $scope.Minval, highprice: $scope.Maxval, isFeatured: "0" };
        $.ajax({
            url: serviceBase + 'api/Product/GetAllproduct',
            type: 'POST',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {
                debugger;
                $scope.total = data.iTotalDisplayRecords;

                $scope.pagedItems = data.aaData;
                var colStartn=0;
                for (var i = 0; i < data.aoColumns.length; i++)
                {

                    if (data.aoColumns[i] == 'CateogryID')
                    {
                        if(colStartn == 0)
                        {
                            colStartn=colStartn+1;
                            continue;
                        }                        
                    }                       
                    else
                    {
                        if(colStartn>0)
                        {
                            $scope.AllProductsColumns.push({ ColName: data.aoColumns[i], colIndex: i });
                        } else {
                            continue;
                        }
                    }
                }
          
                console.log("Data");
                console.log($scope.pagedItems);

                $scope.loadmore = false;

                $scope.loadallproducts = true;

                _TotalRecordsCurrent = data.iTotalDisplayRecords;

                $scope.loadmore = false;
           
                $scope.$apply();

                setTimeout(function () {
                    $scope.totalrecord = data.iTotalDisplayRecords;
                    $scope.$apply();
                }, 1000);
                if (isGlobalSearchActive == true) {
                          isGlobalSearchActive = false;
                    globalSearchstring = "";
                }



                $scope.getattribute();
                setTimeout(function () {
                    _IsLazyLoadingUnderProgress = 0;
                }, 2000);

            
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.loadmore = false;
                $scope.loadallproducts = true;
            }
        });
    }
    $scope.Clearfilter = function () {
        $scope.search = '',
        $scope.categoriesobj = '',
        $scope.categoriesarraySelect = [];
        $scope.AllAttributeFilters = [];
        $scope.Minval = '';
        $scope.Maxval = '';
        CheckScopeBeforeApply();
        $scope.GetProducts();
        $scope.attrarraySelect = [];
    }
    init();



    //Get Image Path 

    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }


    $scope.range = function () {

        var rangeSize = parseInt($scope.itemsPerPage / 3);
        var ret = [];
        var start;

        start = $scope.currentPage;
        if (start > $scope.pageCount() - rangeSize - 1) {
            start = $scope.pageCount() - rangeSize + 1;

        }

        for (var i = start; i < start + (rangeSize - 1) ; i++) {
            if (i > -1) {
                ret.push(i);

            }
        }
        return ret;
    };

    $scope.prevPage = function () {

        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            CheckScopeBeforeApply();
            $scope.startpage = ($scope.currentPage * $scope.itemsPerPage);
            init();
        }
    };

    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.pageCount = function () {
        return Math.ceil($scope.total / $scope.itemsPerPage);
    };


    $scope.DisableCursor = function (path) {
        for (var i = 0; i < $scope.AlreadySelectedImages.length; i++) {
            if ($.trim($scope.AlreadySelectedImages[i]) == $.trim(path)) {
                return "NonePointer";
            }
        }

        return "";
    }

    $scope.nextPage = function () {

        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
            CheckScopeBeforeApply();
            $scope.startpage = ($scope.currentPage * $scope.itemsPerPage);
            init();

        }
    };

    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function (n) {

        $scope.currentPage = n;
        $scope.startpage = n;
        CheckScopeBeforeApply();
        if (n == 0) {
            $scope.startpage = ($scope.startpage * $scope.itemsPerPage);


        }
        else {
            $scope.startpage = ($scope.startpage * $scope.itemsPerPage) + 1;

        }

        init();
    };


    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function AddCatID(CategoryId) {
        debugger;
        var idx = $scope.categoriesarraySelect.indexOf(CategoryId);
        if (idx > -1) {
            // is currently selected
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.checkboxclass = "";
            $scope.categoriesarraySelect.splice(idx, 1);
        }
        else {
            debugger;
            // is newly selected
            $scope.categoriesarraySelect.push(CategoryId);
            $scope.checkboxclass = "fa fa-check";
        }
        $scope.categoriesobj = $scope.categoriesarraySelect.join();
    }
    $scope.AddCatArray = function (CategoryId) {
        debugger;
        AddCatID(CategoryId);

        $scope.GetProducts();
    }


    $(document).on("change", "#sliderChange", function () {
        $scope.pricefilter();
    });

   

    $scope.pricefilter = function () {
        debugger;
        $scope.Minval = $("#slider-snap-value-lower").html();
        $scope.Maxval = $("#slider-snap-value-upper").html();
        init();
    }

    $scope.myFunc = function () {

        $scope.pagedItems = [];
        $scope.setPage = 0;

        $scope.GetProducts();
    };


    //$scope.SetCheckedAttribute = function (Name, Value) {
    //    debugger;
    //    var _ID = $("#attr_" + Value);

    //    for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
    //        if ($scope.AllAttributeFilters[i].Name === Name) {

    //            if ($.trim($scope.AllAttributeFilters[i].Values) != "") {

    //                for (var k = 0; k < $scope.AllAttributeFilters[i].Values.length; k++) {
    //                    var _val = $scope.AllAttributeFilters[i].Values[k];
    //                    if (_val == Value) {

    //                        $(_ID).removeClass("fa-square-o");
    //                        return true;
    //                    }
    //                }
    //            }
    //        }
    //    }

    //    $(_ID).removeClass("fa-square-o").addClass("fa-square-o");
    //    return false;
    //}

    $scope.IsFilterChecked = function (name, Value) {
        debugger;
        var idx = $scope.attrarraySelect.indexOf(Value);
        if (idx > -1) {
            // is currently selected
            $scope.AddAttrToFilter('0', name, Value);
            $scope.attrarraySelect.splice(idx, 1);
        }
        else {
            debugger;
            // is newly selected
      
            $scope.AddAttrToFilter('1', name, Value);
            $scope.attrarraySelect.push(Value);
            $scope.checkboxclass = "fa fa-check";
        }



        //var _ID = "#attr_";

        //if ($(_ID).hasClass("fa-square-o")) {

        //    $scope.AddAttrToFilter('1', name, Value);

        //}
        //else {

        //    $scope.AddAttrToFilter('0', name, Value);

        //}


        $scope.GetProducts();
    }
    function CheckVarFromArray(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }

        }
        return false;
    }
    $scope.AddAttrToFilter = function (ischecked, name, value) {

        // if (ischecked == 1)
        {
            for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
                if ($scope.AllAttributeFilters[i].Name === name) {
                    if (ischecked == "1" || ischecked == 1) {
                        if ($scope.AllAttributeFilters[i].Values.indexOf(value) === -1) {
                            $scope.AllAttributeFilters[i].Values.push(value);
                        }
                    }
                    else {
                        if (CheckVarFromArray($scope.AllAttributeFilters[i].Values, value) == true) {
                            $scope.AllAttributeFilters[i].Values.splice($scope.AllAttributeFilters[i].Values.indexOf(value), 1);
                        }
                    }
                }
            }
        }

        //else {
        //    for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
        //        if ($scope.AllAttributeFilters[i].Name === name) {
        //            if ($scope.AllAttributeFilters[i].Values.indexOf(value) === 1) {

        //                $scope.AllAttributeFilters[i].Values.splice($scope.AllAttributeFilters[i].Values.indexOf(value), 1);
        //            }

        //        }
        //    }
        //}

    }
    $scope.TrimString = function (_String) {

        return $.trim(_String)


    }

    $scope.getValues = function (name) {
        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Name === name) {
                if ($.trim($scope.AllAttributeFilters[i].Values) != "") {



                    return $scope.AllAttributeFilters[i].Values;
                }

            }
        }

        return [];

    }
    $scope.isAlreadyName = function (name) {

        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Name === name) {

                return true;

            }
        }

        return false;

    }


    $scope.showallattribute = function (attname) {
        $(".list_" + attname).attr("style", "max-height:100%;");
        $(".more_" + attname).hide();
        $(".less_" + attname).show();

    }


    $scope.hideallattribute = function (attname) {
        $(".list_" + attname).attr("style", "max-height:230px");
        $(".more_" + attname).show();
        $(".less_" + attname).hide();
    }


    


    var Attributeclass = []; 

   $scope.getattribute = function() {
        $.ajax({
            url: serviceBase + 'api/Product/GetAttributes',
            type: 'Get',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                $scope.Attributes = data;
                localStorage.setItem("AttributesName", JSON.stringify(data));
                console.log("mainAttribute");
                console.log($scope.Attributes);
                CheckScopeBeforeApply();
                for (var i = 0; i < $scope.Attributes.length; i++) {
                    if ($scope.isAlreadyName($scope.Attributes[i].attributeName) != true) {

                        $scope.AllAttributeFilters.push({
                            Name: $scope.Attributes[i].attributeName,
                            Values: $scope.getValues($scope.Attributes[i].attributeName)
                        });
                        Attributeclass.push($scope.Attributes[i].attributeName);
                        console.log("Class array");
                        console.log(Attributeclass);


                    }


                }
                setTimeout(function () {

                    for (var i = 0; i < Attributeclass.length; i++) {


                        var counter = $(".list_" + Attributeclass[i]).find('.form-group').length;

                      

                        if (counter<6) {

                            $(".more_" + Attributeclass[i]).hide();
                        }

                    }
                }, 3000)


                console.log("mixattribute");
                console.log($scope.AllAttributeFilters);
                CheckScopeBeforeApply();
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.Attributes = [];
            }
        });
        $.ajax({
            url: serviceBase + 'api/Product/GetAttributesValue',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                debugger;
                $scope.AttributesValue = data;
                
                localStorage.setItem("AttributesValue", JSON.stringify(data));
                console.log("mainattributeValue");
                console.log($scope.AttributesValue);
                CheckScopeBeforeApply();
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.Attributes = [];
            }
        });
      
    }



    function getIncrementor(_Total) {
        if (_Total <= 100) {
            return 10;
        }
        else if (_Total > 100 && _Total < 500) {
            return 20;
        }
        else if (_Total > 500) {
            return 50;
        }
        else {
            return 10;
        }
    }

    $scope.loadmore = false;
    $(window).scroll(function () {

        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {

        

            if ($(window).scrollTop() >= $(document).height() - $(window).height() - 650)

              {

             

                if ($scope.itemsPerPage < _TotalRecordsCurrent) {



                    _IsLazyLoadingUnderProgress = 1;
                    $scope.itemsPerPage = $scope.itemsPerPage + 20;

                    $scope.loadmore = true;

                    CheckScopeBeforeApply();
                    $scope.GetProducts();
                }
            }
        }



    });


    //window.onload = function () {
    //    localStorage.setItem("filterCategoryID", "");
    //};


}]);


app.filter('unique', function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];

        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});