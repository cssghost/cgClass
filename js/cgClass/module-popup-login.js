cgClass.AddClass(
	"ModulePopupLogin",
	{
		init : function(options){
			var self = this,
				option = $.extend({
					addClass : "module-popup-login",
					url : "url",
					dataType : "json",
					autoShow : true,
					callback : null
				}, options),
				loginPopupCon = '<div class="text Js-name"><input type="text" placeholder="请输入用户名" /><p class="error">请输入用户名</p></div>'+
						'<div class="text Js-password"><input type="password" placeholder="请输入密码" /><p class="error">请输入密码</p></div>'+
						'<div class="remember"><label><input type="checkbox" /> 记住密码</label></div>';
			self.popup = cgClass.Create(
				"Popup",
				{
					type: "popup",
					title: "用户登录",
					addClass: option.addClass,
					template : loginPopupCon,
					autoShow : option.autoShow,
					content : function(opt){
						opt.oCon.on("blur", ".text input", function(){
							self.testLoginNull($(this));
						});
					},
					done : function(opt){
						var $con = opt.oCon,
							$text = $con.find(".text"),
							$name = $con.find(".Js-name input"),
							$psw = $con.find(".Js-password input");
						opt.removeTip();
						if ( $.trim( $name.val() ) == "" || $.trim( $psw.val() ) == "" ) {
							self.testLoginNull($name);
							self.testLoginNull($psw);
							opt.disableBtn(true);
						}
						else{
							$con.find(".error").slideUp();
							$.ajax({
								url : option.url,
								type : "post",
								dataType : option.dataType,
								data : { username : $name.val(), password : $psw.val() },
								success : function(result){
									if ( typeof option.callback == "function" ) {
										option.callback(result, opt);
									}
									// if ( result.success ) {
									// 	opt.close();
									// } else{
									// 	opt.disableBtn(true);
									// 	opt.showTip("用户名或者密码错误");
									// }
								},
								error : function(){
									opt.disableBtn(true);
									opt.showTip("登录失败，请重新尝试");
								}
							});
						}
					},
					cancel : function(opt){
						opt.hide();
					}
				}
			);
		},
		testLoginNull : function($text){
			if ( $.trim( $text.val() ) == "" ) {
				$text.siblings(".error").slideDown("fast").closest(".text").addClass("text-error");
			}else{
				$text.siblings(".error").slideUp("fast").closest(".text").removeClass("text-error");
			}
		},
		show : function(){
			this.popup.reset();
			this.popup.show();
		}
	}
);