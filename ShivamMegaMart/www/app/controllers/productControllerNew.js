'use strict';
app.controller('productController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    $scope.AllAttributeFilters = [];
    $scope.Attributes = [];
    $scope.currentMode = false;
    $scope.AttributesValue = [];
    $scope.AttributesAllValue = [];
    $scope.AllProductsColumns = [];
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
    $scope.AttributefilterSummery = [];
    $scope.Catgoryfiltersummery=[];
    $scope.attrlenght = $scope.AttributesValue.length;
    $scope.categoriesarraySelect = [];
    $scope.attrarraySelect = [];
    $scope.categories = [];
    $scope.Minval = '';
    $scope.Maxval = '';
    $scope.IsLoadingData = false;
    var _IsLazyLoading = 0;
    var _IsLazyLoadingUnderProgress = 0;
    var _TotalRecordsCurrent = 0;
    $scope.loadallproducts = false;

  

    $scope.LoadInMode=function(type)
    {
        switch(type)
        {
            case 'L':
                $scope.currentMode = true;
                break;
            case 'G':
                $scope.currentMode = false;
                break;

        }
        $scope.$apply();
    }

    $scope.AddToCartGlobal = function (productID, product, ID)
    {
        $rootScope.$emit("AddToCart", productID, product, ID, 1, $scope.AllProductsColumns);       
    }

    $rootScope.$on("CategoryID", function (event, ID,Name) {
        debugger;
            
        $scope.AddCatArray(ID, Name);
  
    });

 

    $scope.GetCategories = function () {
        $.ajax({
            url: serviceBase + 'api/Categories/GetCategories',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                $scope.categories = data;
                $scope.$apply();
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.searchcategories = [];
            }
        });
    };

    $scope.SetProduct = function (product)
    {
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        localStorage.setItem("ProductAttribute", JSON.stringify($scope.AllProductsColumns));
        $location.path('/ProductDetail');
    }


    $scope.GetProducts = function ()
    {
        debugger;
      
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
        var _localCategory = localStorage.getItem("CategoryFilterID");
        if (_localCategory != "" && _localCategory != undefined) {
           var _localCategory1=JSON.parse(_localCategory)
            $scope.categoriesobj = _localCategory;
            $scope.categoriesarraySelect.push(_localCategory1);
        }
        else {
            _localCategory = '';
        }
   
        var _model = { displayLength: $scope.itemsPerPage, displayStart: $scope.startpage, searchText: $scope.search, filtertext: FilterText, Categories: $scope.categoriesobj, lowprice: $scope.Minval, highprice: $scope.Maxval, isFeatured: "0", ProductId: "" };
        $.ajax({
            url: serviceBase + 'api/Product/GetAllproduct',
            type: 'POST',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {
                debugger;
                $scope.total = data.iTotalDisplayRecords;
                $scope.pagedItems = data.aaData;
                localStorage.removeItem("CategoryFilterID");
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
                $scope.loadmore = false;
                $scope.loadallproducts = true;
                _TotalRecordsCurrent = data.iTotalDisplayRecords;
                //$scope.loadmore = false;
                
                    $scope.IsLoadingData = false;
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
                debugger;
                $scope.loadmore = false;
                $scope.loadallproducts = true;
            }
        });
    }

    $scope.Clearfilter = function ()
    {
        $scope.IsLoadingData = true;
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
   

    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }



    $scope.GetPath=function(path, index)
    {
        var str_array = path.split(',');
        return str_array[index];
    }



    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function AddCatID(CategoryId, CategoryName)
    {

        debugger;
        var idx = $scope.categoriesarraySelect.indexOf(CategoryId);
       
        if (idx > -1) {          
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.checkboxclass = "";
            $scope.categoriesarraySelect.splice(idx, 1);

            for (var i = 0; i < $scope.Catgoryfiltersummery.length; i++)
            {
                if ($scope.Catgoryfiltersummery[i].Id == CategoryId) {
                    $scope.Catgoryfiltersummery.splice(i, 1);  //removes 1 element at position i 
                    break;
                }
            }
     
        }
        else
        {       
            $scope.categoriesarraySelect.push(CategoryId);
            $scope.Catgoryfiltersummery.push({Id: CategoryId,Name:CategoryName})
            $scope.checkboxclass = "fa fa-check";
        }

        $scope.categoriesobj = $scope.categoriesarraySelect.join();
        $scope.GetProducts();
 
    
    }

    $scope.AddCatArray = function (CategoryId, CategoryName) {
        debugger;
      
        $scope.IsLoadingData = true;
        AddCatID(CategoryId, CategoryName);
      
    }

    $scope.pricefilter = function () {
        if (parseInt($scope.Maxval) <= parseInt($scope.Minval))
        {
            toastr.warning("Max price should be greater then Min price");
        }
        else {
            $scope.IsLoadingData = true;
            $scope.GetProducts();
        }
    }



    $(document).on("click", ".list-group-item",function () {
        debugger;
        $('.icon-action', this)
          .toggleClass('fa fa-chevron-right')
          .toggleClass('fa fa-chevron-down');
    });


    $scope.IsFilterChecked = function (name, Value) {
        debugger;
        $scope.IsLoadingData = true;
        var idx = $scope.attrarraySelect.indexOf(Value);
        if (idx > -1) {
       
            $scope.AddAttrToFilter('0', name, Value);
            $scope.attrarraySelect.splice(idx, 1);

            for (var i = 0; i < $scope.AttributefilterSummery.length; i++) {
                if ($scope.AttributefilterSummery[i].AttributeName == name) {
                    $scope.AttributefilterSummery.splice(i, 1);  //removes 1 element at position i 
                    break;
                }
            }

        }
        else
        {
            $scope.AddAttrToFilter('1', name, Value);
            $scope.AttributefilterSummery.push({AttributeName:name,AttributeValue:Value})
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



    $scope.AddAttrToFilter = function (ischecked, name, value)
    {
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
    }



    $scope.TrimString = function (_String) {
        return $.trim(_String)
    }


    $scope.getValues = function (name)
    {

        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Name === name) {
                if ($.trim($scope.AllAttributeFilters[i].Values) != "")
                {
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


    $scope.showallattribute = function (attname)
    {
        $(".list_" + attname).attr("style", "max-height:100%;");
        $(".more_" + attname).hide();
        $(".less_" + attname).show();

    }


    $scope.hideallattribute = function (attname) {
        $(".list_" + attname).attr("style", "max-height:230px");
        $(".more_" + attname).show();
        $(".less_" + attname).hide();
    }


    $scope.LoadMoreProducts = function () {
        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0)
        {
                if ($scope.itemsPerPage < _TotalRecordsCurrent) {
                    _IsLazyLoadingUnderProgress = 1;
                    $scope.itemsPerPage = $scope.itemsPerPage + 20;
                    $scope.loadmore = true;
                    CheckScopeBeforeApply();
                    $scope.GetProducts();
                }
            
        }
    };

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
                    if ($scope.isAlreadyName($scope.Attributes[i].attributeName) != true)
                      {
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
                    for (var i = 0; i < Attributeclass.length; i++)
                    {
                        var counter = $(".list_" + Attributeclass[i]).find('.form-group').length;
                        if (counter<6) {
                            $(".more_" + Attributeclass[i]).hide();
                        }

                    }
                }, 3000)
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
                $scope.AttributesValue = data;                
                localStorage.setItem("AttributesValue", JSON.stringify(data));       
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
   


    function init() {
        
        $scope.IsLoadingData = true;
        $scope.GetProducts();
        $scope.GetCategories();
    };


    init();

}]);


app.filter('unique', function ()
{
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