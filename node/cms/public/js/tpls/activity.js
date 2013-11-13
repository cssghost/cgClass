$(document).ready(function() {
	$.fn.cgFilter({
		wrap : $(".Js-filter-wrap"),
		radios : [
			{
				groupKey : "activity",
				memberKey : "activity",
				relate : "other",
				resultData : ".Js-filter-hidden-activity",
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
			url : base + "/scene/deals!filterList.do",
			data : {},
			dataType : "text",
			type : "post"
		},
		// ajaxData : null,
		callback : function(result, error){
			// console.log(result, error);
			if ( !error ) {
				$(".hall-list-wrap").html(result);
			}else{

			}
		}
	});
});
