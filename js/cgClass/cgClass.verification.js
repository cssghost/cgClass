cgClass.AddClass(
	"Verification",
	{
		init : function(options){
			var self = this,
				option = $.extend({
			        wrap : $(".wrap"),
			        hookDom: ".Js-verification",
			        inputWrap : ".input-wrap",
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
	        // 默认匹配的正则表达式
			self.map = {
				"notNull" : {
	                msg : "{name}不能为空",
	                reg : /[^\s|.]/
	            },
	            "otherNotNull" : {
	                msg : "{name}不能为空",
	                reg : /[^\s|.]/
	            },
	            "notSelect" : {
	                msg : "{name}为必填项，请选择有效项",
	                reg : /[^\s|.]/
	            },
	            "mobile" : {
	            	msg : "{name}为无效手机格式",
	            	reg : /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/
	            },
	            "email" : {
	            	msg : "{name}为无效邮箱格式",
	            	reg : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	            },
	            "url" : {
	            	msg : "{name}为无效网址格式",
	            	reg : /^(\w+:\/\/)?\w+(\.\w+)+.*$/
	            },
	            "onlyNumLastTwo" : {
	                msg : "{name}只能是数字,最多2位小数",
	                reg : /^\d+(\.\d{1,2})?$/
	            },
	            "onlyNum" : {
	                msg : "{name}只能是数字",
	                reg : /^\d+(.\d+)?$/
	            },
	            "onlyNumFloat" : {
	                msg : "{name}只能是数字",
	                reg : /^\d+(.\d+)?$/
	            },
	            "notSpecialChar" : {
	                msg : "{name}不能包含特殊字符",
	                reg : /^[\w\u4E00-\u9FA5]+$/
	            },
	            "numLast" : {
	                msg : "{name}只能是数字,小数位为{range}", //numLast,{1-2}
	                fun : self.numLast
	            },
	            "numRange" : {
	                msg : "{name}数值范围为{range}",  //numRange,{1-2}
	                fun : self.numRange
	            },
	            "strRange" : {
	                msg : "{name}字数范围为{range}",  //strRange,{1-2}
	                fun : self.strRange
	            },
	            "isHave" : {
	                msg : "{name}重复",
	                fun : self.isHave
	            }
			};	
			self.flag = false;
			self.option = option;
			if ( !!option.map ) {
				self.map = $.extend(self.map, option.map);
			}

			var $wrap = option.wrap;

			/* do something */
			self.outParam = self.applyMethods(self, {
				option : options
			});

			$wrap.on("blur", option.hookDom, function(){
				var $dom = $(this),
					dataVer = $dom.data("ver"),
					tagName = $dom.get(0).nodeName,
					tagType = $dom.get(0).type,
					val = "";
				if ( tagName == "INPUT" ) {
					switch(tagType){
						case "radio":
							var $radio = $wrap.find(":radio[name=" + $dom.attr("name") + "]");
							val = $radio.filter(":checked").length;
							// console.log("radio");
						break;
						case "checkbox":
							var $checkbox = $wrap.find(":checkbox[name=" + $dom.attr("name") + "]");
							val = $checkbox.filter(":checked").length;
							// console.log("checkbox");
						break;
						default:
							// console.log("text");
							val = $dom.val();
						break;
					}
				}else{
					switch(tagType){
						case "select-one":
							val = $dom.val();
							// console.log("select-one");
						break;
						case "select-multiple":
							val = $dom.children().length;
							// console.log("select-multiple");
						break;
						default:
						break;
					}
				}
				// console.log(val);
				self.parseVer(dataVer, val, $dom);
			});

		},
		parseVer : function(data, val, dom){
			var self = this,
				verData = data && data.match(/(^.*)\:(\S+)/),
				name, vers, result, flag = false;
			if ( !!verData ) {
				name = verData[1];
				vers = verData[2].split("/");
				if ( $.trim(val) == "" ) {
					if( $.inArray("notNull", vers) != -1 ){
						self.flag = false;
						self.thrown(dom, name + "不能为空");
					}else{
						self.verified(dom);
					}
				}else{
					for(var i = 0; i < vers.length; i++){
						result = self.match(val, name, vers[i], dom);
						if ( result != "ajax" && !result ){
							break;
						}
					}
				}
			}
			// else{
			// 	alert("验证信息配置有误，请检查代码");
			// }
		},
		match : function(val, name, ver, dom){
			var self = this,
				_ver = ver.match(/^([^\,]+)\,\{?([^\}]+)\}?$/), // 匹配"ver,({)xxx(})" ==> [1]:ver, [2]:xxx
				term = !!_ver ? self.map[_ver[1]] : self.map[ver],
				msg = "", doTest;
			// 验证条件存在时
			if ( !!term) {
				msg = term.msg && term.msg.replace("{name}", name);
				// 正则验证时
				if ( !!term.reg ) {
					if ( term.reg.test(val) ) {
						// self.verified(dom);
						return true;
					}else{
						self.thrown(dom, msg);
						return false;
					}
				}
				// 函数验证时
				if ( !!term.fun ) {
					if ( !!_ver ) {
						doTest = term.fun(val, msg, dom, _ver[2]);
					}else{
						doTest = term.fun(val, msg, dom, ver);
					}
					if ( !!doTest.result ) {
						console.log("ver success");
						doTest.result != "ajax" && self.verified(dom);
					}else{
						console.log("ver error");
						self.thrown(dom, doTest.msg);
					}
					return doTest.result;
				}
			}
			else{
				alert("验证信息配置有误，请检查代码");
			}
		},
		verified : function(dom){
	        var self = this,
	    		temp = "",
	    		$nextAll = dom.nextAll();
	        dom.nextAll(".Js-verification-state").remove();
	        if ( self.option.errorTemp != null) {
	            temp = self.option.errorTemp(msg);
	        }else{
	            temp = '<a href="javascript:void(0);" class="state right Js-verification-state">&nbsp;</a>';
	        }
	        if ( $nextAll.length ) {
	            $nextAll.last().after(temp);
	        } else{
	            dom.after(temp);
	        }
	    },
	    thrown : function(dom, msg){
	    	var self = this,
	    		temp = "";
	        dom.nextAll(".Js-verification-state").remove();
	        if ( self.option.errorTemp != null) {
	            temp = self.option.errorTemp(msg);
	        }else{
	            temp = '<a href="javascript:void(0);" class="state error Js-verification-state">' + msg + '</a>';
	        }
	        var $nextAll = dom.nextAll();
	        if ( $nextAll.length ) {
	            $nextAll.last().after(temp);
	        } else{
	            dom.after(temp);
	        }
	    },
	    numLast : function(val, msg, dom, range){
	    	var self = this;
	            valMin = range.split("-")[0],
	            valMax = range.split("-")[1],
	            _reg = new RegExp('^\\d+(\\.\\d{' + valMin + ',' + valMax + '})$');
	        msg = msg.replace("{range}", range);
	        if(_reg.test(val)) {
	            return { result : true, msg : msg };
	        } else {
	            return { result : false, msg : msg };
	        }
	    },
	    numRange : function(val, msg, dom, range){

	    },
	    strRange : function(val, msg, dom, range){

	    },
	    isHave : function(val, msg, dom, range){
	    	var self = this;
	    	cgClass.Ajax({
	    		url : "api/area.txt",
	    		type: "get",
	    		dataType: "textJson",
	    		queue : "ver",
	    		queueCallback : function(){
	    			console.log("fuck");
	    		},
	    		success: function( request, statusText ){
	    			/* do something */
	    		},
	    		error: function( request, statusText, error ){}
	    	});
	    	return { result : "ajax", msg : msg };
	    }
	}
);
cgClass.ajaxQueueCallback.ver = function(){
	console.log("finish");
}
