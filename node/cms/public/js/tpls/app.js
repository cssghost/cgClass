$(document).ready(function() {
	$.fn.cgFilter({
		wrap : $(".Js-filter-wrap"),
		radios : [
			{
				groupKey : "app",
				memberKey : "system",
				relate : "other",
				resultData : ".Js-filter-hidden-system",
				isShow : true
			},
			{
				groupKey : "app",
				memberKey : "category",
				relate : "other",
				resultData : ".Js-filter-hidden-category",
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
			url : base + "/scene/apps!filterList.do",
			data : {},
			dataType : "text",
			type : "post"
		},
		beforeAjax : function(data){
			return { currPage : 1 };
		},
		// ajaxData : null,
		callback : function(result, error){
			// console.log(result, error);
			if ( !error ) {
				$(".Js-app-list").html(result);
			}else{

			}
		}
	});
});
