$(document).ready(function() {
	$.cgTag({
		wrap : $(".Js-hall-content-wrap"),
		tagList : ".handover",
		tagItem : ".Js-hall-tag",
		conList : ".hall-frame",
		conItem : ".Js-hall-list",
		curClass : "selected",
		callback : function(arg1, arg2){
			var reqData = "locationId=" + $(".Js-filter-hidden-hall").val() + "&isMapContent=" + arg1.data("mapcontent");
			$.post(base + "/scene/businessoffice!listContent.do", reqData, function(data) {
				$(".Js-hall-content-wrap").html(data);
			});
		}
	});
	$.fn.cgFilter({
		wrap : $(".Js-filter-wrap"),
		radios : [
			{
				groupKey : "hall",
				memberKey : "locationId",
				relate : "other",
				resultData : ".Js-filter-hidden-hall",
				isShow : true
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
		resultWrap : ".filter-result-list",
		ajaxData : {
			url : base + "/scene/businessoffice!listContent.do",
			data : {},
			dataType : "html",
			type : "post"
		},
		beforeAjax : function(data){
			return { isMapContent : $('.Js-isMap').val() };
		},
		// ajaxData : null,
		callback : function(result, error){
			// console.log(result, error);
			if ( !error ) {
				$(".list-wrap").html(result);
			}else{

			}
		}
	});
});
