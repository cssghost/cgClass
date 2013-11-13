cgClass.AddClass(
	"Set",
	{
		init : function(options){
			var self = this,
				option = $.extend({
					wrap : $(".wrap"),
					preview : ".preview",
					reset : ".reset",
					set : ".set",
					form : ".form",
					cssfile : "robot.css"
				}, options),
				$wrap = option.wrap,
				$preview = $wrap.find(option.preview),
				$reset = $wrap.find(option.reset),
				$set = $wrap.find(option.set),
				$form = $wrap.find(option.form);

			$form.submit(function(){
				$(this).ajaxSubmit({
		            success: function (result) {
		            	if(result == "success"){
		            		var _src = $("iframe").attr("src");
		            		$("iframe").attr("src", _src);
		            		// $("iframe").get(0).location.reload();
		            	}
		            },
		            error: function (msg) {
		                alert("文件上传失败");    
		            }
				});
				return false;
			});

			$wrap.on("click", ".preview", function(){
				$form.submit();
			}).on("click", option.reset, function(){
				
			}).on("click", option.set, function(){
				
			});
			
			self.outParam = self.applyMethods(self, {
				option : options
			});
		}
	}
);