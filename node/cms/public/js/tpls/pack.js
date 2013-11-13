$(document).ready(function() {
	var _packCompare = "";
	$.fn.cgFilter({
		wrap : $(".Js-filter-wrap"),
		sliders : [
			{
				wrap : ".Js-pay-slider-wrap",
				groupKey : "packPay",
				memberKey : "packPay",
				relate : "other",
				resultData : ".Js-filter-hidden-packPay",
				scales : [0, 200, 400, 600, 800, 1000, "∞"],
				max : 1200,
				maxShow : {
					number : 1200,
					text : "不限",
					param : 5000
				},
				input : {
					has : true,
					unit : "元"
				},
				isFixed : true,
				def : {
					label : 1200,
					val : 1200,
					onlyShow : false
				},
				init : {
					label : 1200,
					val : 1200,
					onlyShow : true
				}
			},
			{
				wrap : ".Js-pack-sider-time",
				groupKey : "mobile",
				memberKey : "runtime",
				relate : "other",
				resultData : ".Js-filter-hidden-runtime",
				scales : [0, 200, 400, 600, 800, 1000],
				max : 1000,
				maxShow : {
					number : 1000,
					text : "不限",
					param : 5000
				},
				def : {
					label : 0,
					val : 0,
					onlyShow : true
				},
				input : {
					has : true,
					unit : "分钟"
				}
			}
		],
		radios : [
			{
				groupKey : "net",
				memberKey : "net",
				relate : "other",
				resultData : ".Js-filter-hidden-net"
			},
			{
				groupKey : "mobile",
				memberKey : "bag",
				relate : "more",
				resultData : ".Js-filter-hidden-bag"
			},
			{
				groupKey : "mobile",
				memberKey : "flow",
				relate : "more",
				resultData : ".Js-filter-hidden-flow"
			},
			{
				groupKey : "mobile",
				memberKey : "message",
				relate : "more",
				resultData : ".Js-filter-hidden-message"
			},
			{
				groupKey : "mobile",
				memberKey : "wifi",
				relate : "more",
				resultData : ".Js-filter-hidden-wifi"
			}
		],
		checkboxs : [
			{
				groupKey : "net",
				memberKey : "broadband",
				relate : "other",
				resultData : ".Js-filter-hidden-broadband"
			},
			{
				groupKey : "mobile",
				memberKey : "phone",
				relate : "other",
				resultData : ".Js-filter-hidden-phone"
			},
			{
				groupKey : "tel",
				memberKey : "tel",
				relate : "other",
				resultData : ".Js-filter-hidden-tel"
			}
		],
		others : [
			{
				groupKey : "otherDef",
				memberKey : "otherDef",
				relate : "other",
				resultData : ".Js-filter-hidden-otherdef"
			}
		],
		checkClass : "selected",
		checkboxWrap : ".Js-pack-filter-title-checkbox",
		resultWrap : ".filter-result-list",
		ajaxData : {
			url : base + "/scene/bundle!filterList.do",
			data : {},
			dataType : "html",
			type : "post"
		},
		// ajaxData : null,
		callback : function(result, error){
			// console.log(result, error);
			if ( !error ) {
				$(".pack-table-wrap").html(result);
				// add after append html
				if ( _packCompare.length ) {
					$.each(_packCompare.split(","), function(index, item){
						$(".pack-table-wrap").find("input:checkbox[data-id='" + item + "']").prop("checked", true).closest(".btn").removeClass("btn-white").addClass("btn-blue").prop("checked", true);
					});
				}
			}else{

			}
		}
	});
	$.cgProdContrast({
		mainWrap : $(".content-center"),
		checkGroupName : "pack-contrast",
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
		type : "pack",
		init : function(){
			// console.log(opt);
		},
		checkFun : function($checks, contrast){
			_packCompare = _packCompare + "," + $checks.data("id");
			_packCompare = _packCompare.replace(/^\,/gi, "");
			$checks.closest(".btn").removeClass("btn-white").addClass("btn-blue");
		},
		unCheckFun : function($checks){
			_packCompare = _packCompare.replace($checks.data("id"), "").replace(/\,\,/gi, ",").replace(/^\,|\,&/gi, "");
			$checks.closest(".btn").removeClass("btn-blue").addClass("btn-white");
		},
		callback : function(opt, val){
			window.open( base + "/compare!list.do?ids=" + val.replace(/\&/gi, "\,"), '_blank' );
			// window.location.href = "#/compare/" + val;
		}
	});
	// change pack list more or less
	$(".content-center").on("click", ".drawer", function(){
		var $btn = $(this),
			$paging = $btn.siblings(".turn-toggle"),
			$table = $btn.closest(".table-wrap").find(".normal-table");
		if ( $btn.hasClass("open") ) {
			//$paging.show();	
			//edit by chenping 1003
			$btn.removeClass("open");
			$table.find("tr:eq(4)").nextAll().show();
		} else{
			//$paging.hide();
			//edit by chenping 1003
			$btn.addClass("open");
			$table.find("tr:eq(4)").nextAll().hide();
		}
	});
});
