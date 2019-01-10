'use strict';
app.controller('ProductDetailController', ['$scope', '$route','$rootScope', 'localStorageService', '$location', 'authService', function ($scope,$route, $rootScope, localStorageService, $location, authService) {
    $scope.authentication = authService.authentication;
    $scope.Quantity = 1;
    $scope.product = [];
    $scope.Images = [];
    $scope.CurrentWishList = [];
    $scope.Image = [];
    $scope.similarproduct = [];
    $scope.emailvalidation = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.allProductDetailNewWithAttr = [];
    $scope.Selproattr = [];
    $scope.myselected = '';
    $scope.IsProductLoading = false;
    $scope.ItemCartQuantity = 0;
    $scope.AllProductsColumns = [];

    var _localProductDetail = localStorage.getItem("ProductDetail");
    if (_localProductDetail != null && _localProductDetail != undefined)
    {
        _localProductDetail = JSON.parse(_localProductDetail);
    }
    else {
        _localProductDetail = [];
    }

    var slider = false;
    var _AttributesName = [];
    $scope.AttributesName = [];
    $scope.Tempproduct = _localProductDetail;


    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.AddToCartGlobal = function (productID, product, ID, CartQuantity)
    {    
        debugger;
        if (ID == "ProductDetails") {
            $rootScope.$emit("AddToCart", productID, product, ID, 1, $scope.AllProductsColumns);
        }
        else {
            var _localProductDetail = localStorage.getItem("ProductAttribute");
            if (_localProductDetail != null && _localProductDetail != undefined) {
                _localProductDetail = JSON.parse(_localProductDetail);
            }
            else {
                _localProductDetail = [];
            }
            var quantity = JSON.parse(CartQuantity);

            $rootScope.$emit("AddToCart", productID, product, ID, quantity, _localProductDetail);
        }
    }

    $scope.addTowishList = function (productID,product,ID)
    {
        $rootScope.$emit("addTowishList", productID,product,ID);
    }

    $scope.SelecteditemDetail = [];

    $scope.GetProductImage = function (Path) {
     
        if (Path != undefined && $.trim(Path.split(',')[0]) != "") {
            
            return _GlobalImagePath + "ProductImages/" + Path.split(',')[0];
        }
        return "../img/no-image.png";
       
    }
    

    $scope.changeimage = function (Data) {
        debugger
        $("#mainImage").attr("src", "");
        // $("#mainImage").attr("data-zoom-image", "");
        var src = $("#Image_" + Data).attr("src");
        $("#mainImage").attr("src", src);
        //$("#mainImage").attr("data-zoom-image", src);
        //$("#mainImage").elevateZoom();
    }

    function CheckIfValueAvailable(Column, Value)
    {
        var _attributesDataArray = $scope.AttributesData;
        for (var i = 0; i < _attributesDataArray.length; i++) {
            if (_attributesDataArray[i].attributeName == Column && _attributesDataArray[i].attributeValue == Value) {
                return i;
            }
        }
        return -1;
    }


    $scope.GetAttributesData = function (Data) {
        var _array = [];
        for (var i = 0; i < $scope.AttributesData.length; i++) {
            if ($scope.AttributesData[i].attributeName == Data) {
                if ($.trim($scope.AttributesData[i].attributeValue)) {
                    var itemdata = _array.filter(function (item) {

                        return item === $scope.AttributesData[i].attributeValue;
                    })[0];

                    if (itemdata == undefined || itemdata == null) {
                        _array.push($scope.AttributesData[i].attributeValue);

                    }

                }
            }

        }
        return _array;
    }

    $scope.GetOtherDetails = function (item) {
        debugger;
        var allValues = item == undefined ? [] : item.split("#");
        for (var i = 0; i < $scope.SelecteditemDetail.length; i++) {
            if (allValues[0] == $scope.SelecteditemDetail[i].AttrName) {
                $scope.SelecteditemDetail[i].AttrValue = allValues[1];
            }
        }

        if (checkforProductDetail() == false) {
            alert("please select all attribute values");
        } else {

            for (var i = 0; i < $scope.similarproduct.length; i++) {
                var ProductCounter = 0;
                for (var k = 0; k < $scope.similarproduct[i].productAttrubutes.length; k++) {

                    for (var count = 0; count < $scope.SelecteditemDetail.length; count++) {
                        if ($scope.similarproduct[i].productAttrubutes[k].attrName == $scope.SelecteditemDetail[count].AttrName && $scope.similarproduct[i].productAttrubutes[k].attrvalue.toUpperCase() == $scope.SelecteditemDetail[count].AttrValue) {
                            ProductCounter = ProductCounter + 1;
                            if ($scope.SelecteditemDetail.length == ProductCounter) {
                                $scope.product.Images = $scope.similarproduct[i].productImage;
                                $scope.product.ProductCost = $scope.similarproduct[i].productAttrubutes[k].price;
                                $scope.product.ProductQuantity = $scope.similarproduct[i].productAttrubutes[k].quantity;
                                $scope.product.ProductId = $scope.similarproduct[i].productAttrubutes[k].prID;
                                $scope.product.ProductReviews = 0;
                                $scope.product.ProductName = $scope.similarproduct[0].productName;
                                $scope.product.Productd = $scope.similarproduct[0].productDesc;
                                $scope.product.PID = $scope.Tempproduct[8];
                       
                                $scope.product.allAttributes = $scope.similarproduct[i].productAttrubutes;                                                                       
                                $scope.GetReviews(1);
                                //$("#mainImage").elevateZoom();
                                break;
                            }
                            else
                                continue;
                        }
                    }

                }
            }








        }
    }

    $scope.getselectedvalue = function (attributeName, attributeValue)
    {
     
        var itemNew = JSON.parse(localStorage.getItem("ProductDetail"));
          for (var k = 0; k < $scope.Selproattr.length; k++) {

              if ($scope.Selproattr[k].ColName == attributeName && attributeValue == itemNew[$scope.Selproattr[k].colIndex].toUpperCase()) {
                  return true;
              
            }
        }
    }

    function checkforProductDetail() {
        var isnot = true;
        for (var i = 0; i < $scope.SelecteditemDetail.length; i++) {
            if ($scope.SelecteditemDetail[i].AttrValue == '')
            {
                var itemNew = JSON.parse(localStorage.getItem("ProductDetail"));
                var itemattribute = JSON.parse(localStorage.getItem("ProductAttribute"));
                for (var k = 0; k < itemattribute.length; k++) {

                    if (itemattribute[k].ColName == $scope.SelecteditemDetail[i].AttrName) {
                        $scope.SelecteditemDetail[i].AttrValue = itemNew[itemattribute[k].colIndex].toUpperCase();
                       
                    }
                }           
            }
        }
        return isnot;
    }

    $scope.Similarproduct = function (ProductId) {
        debugger;
        var itemNew = JSON.parse(localStorage.getItem("ProductDetail"));
        var itemattribute = JSON.parse(localStorage.getItem("ProductAttribute"));
        $scope.Selproattr = itemattribute;
        $.ajax({
            type: 'get',
            url: serviceBase + 'api/Product/Similarproduct',
            data: { productID: itemNew[4] },
            dataType: "json",
            success: function (result) {
                $scope.similarproduct = result.allAttributes;
                if ($scope.similarproduct.length > 0) {
                    $scope.allProductDetailNewWithAttr.push({
                        ProductName: $scope.similarproduct[0].productName,
                        ProductVersionId: $scope.similarproduct[0].id,
                        SuppplierName: $scope.similarproduct[0].supplierName,
                        description: $scope.similarproduct[0].productDesc,
                        ProductAttributes: []
                    });
                    for (var i = 0; i < $scope.similarproduct[0].productAttrubutes.length; i++) {
                        $scope.allProductDetailNewWithAttr[0].ProductAttributes.push({

                            AttrName: $scope.similarproduct[0].productAttrubutes[i].attrName,
                            AttrValues: []
                        });
                    }
                    for (var i = 0; i < $scope.similarproduct.length; i++) {
                        for (var k = 0; k < $scope.similarproduct[i].productAttrubutes.length; k++) {
                            if (isAttrExist($scope.allProductDetailNewWithAttr[0].ProductAttributes[k].AttrValues, $scope.similarproduct[i].productAttrubutes[k].attrvalue.toUpperCase()) == false) {
                                $scope.allProductDetailNewWithAttr[0].ProductAttributes[k].AttrValues.push({
                                    productId: $scope.similarproduct[i].productAttrubutes[k].prID,
                                    quantityAvailable: $scope.similarproduct[i].productAttrubutes[k].quantity,
                                    Cost: $scope.similarproduct[i].productAttrubutes[k].price,
                                    Value: $scope.similarproduct[i].productAttrubutes[k].attrvalue.toUpperCase()
                                });
                            }

                        }

                    }
                }

                for (var i = 0; i < $scope.allProductDetailNewWithAttr[0].ProductAttributes.length; i++) {
                    if ($scope.allProductDetailNewWithAttr[0].ProductAttributes[i].AttrValues.length > 0) {
                        $scope.SelecteditemDetail.push({ AttrName: $scope.allProductDetailNewWithAttr[0].ProductAttributes[i].AttrName, AttrValue: '' });
                    }
                }
                debugger;     
                $scope.$apply();
                
                $scope.GetOtherDetails();

            }
        });
    }

    function isAttrExist(arry, stringtocheck) {
        var retunv = false;
        for (var i = 0; i < arry.length; i++) {
            if (arry[i].Value == stringtocheck) {
                retunv = true;
                break;
            }
        }
        return retunv;
    }

    $scope.GetRelatedPrdoucts = function () {

        var itemNew = JSON.parse(localStorage.getItem("ProductDetail"));
        var _model = { displayLength: 15, displayStart: 0, searchText: '', filtertext: '', Categories: itemNew[14], lowprice: '', highprice: '', isFeatured: "0", Productid: '' };
        $.ajax({
            url: serviceBase + 'api/Product/GetAllproduct',
            type: 'POST',
            data: _model,
            dataType: "json",
            success: function (data) {
              
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
                $scope.RelatedProducts = data.aaData;         
                $scope.$apply();
                $(".owl-carousel.owl-theme.GetRelatedPrdoucts").owlCarousel({

                    // Show next and prev buttons
                    dots: false,
                    items: $scope.RelatedProducts.length,
                    margin: 15,
                    responsiveClass: true,
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
            }
            

        });

    }
    $scope.SetProduct = function (product)
    {
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        $route.reload();
    }



    $scope.review = { ProductId: $scope.Tempproduct[8], Productattrid: $scope.Tempproduct[8], Name: '', Email: '', Review: '', Rating: 0 };

    $scope.GetSelectedClass = function (rating) {
        if ($scope.review.Rating == rating || $scope.review.Rating > rating) {
            return "text-primary";
        }
        return "";
    }
  
    $scope.reviews = [];

    $scope.AddReview = function (ProductName)
    {
        var authData = localStorageService.get('authorizationData');
        if (authData == null) {
            var url = $location.url();
            localStorage.setItem("currentUrl", JSON.stringify(url));
            $location.path("/login");
            $scope.$apply();
        }
        else {



            var reviews = $scope.review;
            reviews.ProductId = $scope.allProductDetailNewWithAttr[0].ProductVersionId;
            reviews.Productattrid = $scope.product.ProductId
            $("#AddReview").addClass("disabled");

            $.ajax({

                type: 'POST',
                url: serviceBase + '/api/CustomerReviews/PostCustomerReview',
                data: reviews,
                dataType: "Json",
                success: function (resultData) {

                    if (resultData.success == true) {

                        $scope.review = { ProductId: $scope.allProductDetailNewWithAttr[0].ProductVersionId, Productattrid: $scope.product.ProductId, Name: '', Email: '', Review: '', Rating: 0 };
                        swal("Add Review for!", ProductName, "success")
                        $("#AddReview").removeClass("disabled");
                        $scope.GetReviews($scope.Tempproduct[8]);
                    }
                    else {
                        alert(resultData.error);
                    }
                }
            });
        }
    };

    $scope.GetReviews = function (ProductId) {
        $.ajax({
            type: 'Get',
            url: serviceBase + 'api/CustomerReviews/GetCustomerReviews',
            data: { ProductId: $scope.product.ProductId },
            dataType: "json",
            success: function (resultData) {
                if (resultData.success == true) {
                    $scope.product.reviews = resultData.data;              
                    $scope.$apply();
                }
                else {
                    alert(resultData.error);
                }
            }
        });
    };

    $scope.Ratingcheck = function (rating, id, name) {
        switch (rating) {
            case "0":
                $(".Rating_" + id + "").html('<i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o  text-primary"></i>');
                break

            case "1":
                $(".Rating_" + id + "").html('<i class="fa fa-star text-primary"></i><i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o  text-primary"></i>');
                break

            case "2": {
                $(".Rating_" + id + "").html('<i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o text-primary"></i>');
                break
            }

            case "3":
                $(".Rating_" + id + "").html('<i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star-o  text-primary"></i><i class="fa fa-star-o  text-primary"></i>');
                break

            case "4": {
                $(".Rating_" + id + "").html('<i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star-o text-primary"></i>');
                break
            }

            case "5":
                $(".Rating_" + id + "").html('<i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i><i class="fa fa-star text-primary"></i>');
                break
            default:
                {
                    $(".Rating" + _id).html('<i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o text-primary"></i><i class="fa fa-star-o text-primary"></i>');
                    return true;

                    break
                }
        }

    }
    $('.btn-num-product-down').on('click', function (e) {
        debugger;
        e.preventDefault();
        $scope.Quantity = Number($(this).next().val());
        if ($scope.Quantity > 1)
        {
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
    $(document).on("click", ".cs-pointer", function () {
        debugger;
        $('.down-mark', this)
          .toggleClass('fa fa-plus')
          .toggleClass('fa fa-minus');
    });



    function init() {
      
    $scope.Similarproduct($scope.Tempproduct[8]);
    $scope.GetRelatedPrdoucts();

}

    init();
}]);

