cgClass.AddClass(
	"Verification",
	{
		init : function(options){
			var self = this,
				option = $.extend({
			        wrap : $(".wrap"),
			        hookDom: ".Js-verification",
			        map : "",
			        btn : $("Js-btn"),
			        parseAjaxData : null,
			        successTemp : null,
			        errorTemp : null,
			        init : function(){},
			        error : function(){},
			        success : function(){},
			        otherInput : ".other"
                }, options);

			/* do something */
			self.outParam = self.applyMethods({
				option : options
			});
		}
	}
);
