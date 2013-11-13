$(document).ready(function() {
	var _mobileCompare = "";
	// bind toggle more wrap
	$(".phone-content").on("click", ".toggle-more", function(){
		var $toggle = $(this),
			$toggleWrap = $(this).closest(".toggle-more-wrap");
		if ( $toggle.hasClass("toggle-less") ) {
			$toggle.removeClass("toggle-less").text("更多");
			$toggleWrap.css("height", "25px");
		} else{
			$toggle.addClass("toggle-less").text("收起");
			$toggleWrap.css("height", "auto");
		}
	});
	$.fn.cgFilter({
		wrap : $(".Js-filter-wrap"),
		radios : [
			{
				groupKey : "mobile",
				memberKey : "brand",
				relate : "other",
				resultData : ".Js-filter-hidden-brand",
				isShow : true
			},
			{
				groupKey : "mobile",
				memberKey : "price",
				relate : "other",
				resultData : ".Js-filter-hidden-price",
				isShow : true
			},
			{
				groupKey : "mobile",
				memberKey : "system",
				relate : "other",
				resultData : ".Js-filter-hidden-system",
				isShow : true
			},
			{
				groupKey : "mobile",
				memberKey : "screen",
				relate : "other",
				resultData : ".Js-filter-hidden-screen",
				isShow : true
			}
		],
		others : [
			{
				groupKey : "otherDef",
				memberKey : "keyword",
				relate : "other",
				resultData : ".Js-filter-hidden-otherdef"
			}
		],
		checkClass : "selected",
		resultWrap : ".filter-result-list",
		ajaxData : {
			url : base + "/scene/mobilephone!filterList.do",
			data : {},
			dataType : "html",
			type : "post"
		},
		beforeAjax : function(data){
			var $contentWrap = $(".phone-content"),
				$sortDate = $contentWrap.find(".Js-sort-date"),
				$sortPrice = $contentWrap.find(".Js-sort-price"),
				__resultData = {};
			if ( $sortDate.hasClass("Js-sort-select") ) {
				__resultData = { sortDate : $sortDate.data("sort") };
			}else{
				__resultData = { sortPrice : $sortPrice.data("sort") };
			}
			return __resultData;
		},
		callback : function(result, error){
			// console.log(result, error);
			if ( !error ) {
				$(".mobile-list-box").html(result);
				$(".total").html($(".totalInput").val());
				// add after append html
				if ( _mobileCompare.length ) {
					$.each(_mobileCompare.split(","), function(index, item){
						$(".phone-content").find("input:checkbox[data-id='" + item + "']").prop("checked", true).closest(".btn").removeClass("btn-white").addClass("btn-blue").prop("checked", true);
					});
				}
			}else{

			}
		},
		init : function(opt){
			var $mobileWrap = $(".Js-filter-wrap");
			if ( $(".Js-filter-wrap").find(".Js-filter-hidden-brand").val() != "" ) {
				var $moreWrap = $mobileWrap.find(".filter-item-list[data-member-key='brand']").closest(".toggle-more-wrap");
				$moreWrap.find(".toggle-more").click();
			}
			var $contentWrap = $(".phone-content"),
				$sortDef = $contentWrap.find(".Js-sort-default"),
				$sortDate = $contentWrap.find(".Js-sort-date"),
				$sortPrice = $contentWrap.find(".Js-sort-price"),
				chooseSort = function($add, $remove){
					var _addType = $add.data("sort"),
						_removeType = $remove.data("sort"),
						_hadSelect = $add.hasClass("Js-sort-select"),
						_chooseType = "";
					$add.removeClass("Js-sort-select up down selected-up selected-down");
					$remove.removeClass("Js-sort-select up down selected-up selected-down");
					if ( _hadSelect ) {
						if ( _addType == "up" ) {
							$add.data("sort", "down");
						} else{
							$add.data("sort", "up");
						}
						_chooseType = $add.data("sort");
					}else{
						_chooseType = _addType;
					}
					$add.addClass("Js-sort-select selected-" + _chooseType);
					$remove.addClass(_removeType);
					opt.callback();
				};
			$(".phone-content").on("click", ".Js-sort-default", function(){
				$sortDate.removeClass("Js-sort-select up down selected-up selected-down").addClass("Js-sort-select selected-down");
				$sortPrice.removeClass("Js-sort-select up down selected-up selected-down").addClass("up");
				$sortDate.data("sort", "down");
				$sortPrice.data("sort", "up");
				opt.callback();
			});
			$(".phone-content").on("click", ".Js-sort-date", function(){
				chooseSort($sortDate, $sortPrice);
			});
			$(".phone-content").on("click", ".Js-sort-price", function(){
				chooseSort($sortPrice, $sortDate);
			});
		}
	});
	$.cgProdContrast({
		mainWrap : $(".content-center"),
		checkGroupName : "mobile-contrast",
		checkVal : {
			id : "data-id",
			name : "data-name",
			price : "data-price",
			image : "data-image"
		},
		contrastWrap : $(".Js-contrast-wrap"),
		contrastList : $(".Js-contrast-list"),
		contrastItem : ".Js-contrast-item",
		contrastTemp : $("#Js-contrast-item-template"),
		contrastClose : ".Js-contrast-close",
		contrastRemoveBtn : ".Js-remove-item",
		contrastClearBtn : ".Js-contrast-clear",
		contrastBtn : $(".Js-contrast-btn"),
		contrastBtnClass : "contrast-submit-btn",
		contrastTips : $(".Js-contrast-tips"),
		contrastQuickBtn : $(".Js-show-contrast"),
		max : 4,
		type : "mobile",
		init : function(){
			// console.log(opt);
		},
		checkFun : function($checks, contrast){
			_mobileCompare = _mobileCompare + "," + $checks.data("id");
			_mobileCompare = _mobileCompare.replace(/^\,/gi, "");
			$checks.closest(".btn").removeClass("btn-white").addClass("btn-blue");
		},
		unCheckFun : function($checks){
			_mobileCompare = _mobileCompare.replace($checks.data("id"), "").replace(/\,\,/gi, ",").replace(/^\,|\,&/gi, "");
			$checks.closest(".btn").removeClass("btn-blue").addClass("btn-white");
		},
		callback : function(opt, val){
			window.open( base + "/compare!list.do?ids=" + val.replace(/\&/gi, "\,"), '_blank' );
			// window.location.href = "#/compare/" + val;
		}
	});
});
