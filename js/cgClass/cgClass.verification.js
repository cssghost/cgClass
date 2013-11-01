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
	                msg : "{name}只能是数字,小数位为{range}" //numLast,{1-2}
	            },
	            "numRange" : {
	                msg : "{name}数值范围为{range}"  //numRange,{1-2}
	            },
	            "strRange" : {
	                msg : "{name}字数范围为{range}"  //strRange,{1-2}
	            },
	            "isHave" : {
	                msg : "{name}重复"
	            }
			};	
	        self.flag = true;
	        self.errorDom = null;
			self.ajaxQueue = {};
			self.option = option;
			if ( !!option.map ) {
				self.map = $.extend(self.map, option.map);
			}

			var $wrap = option.wrap;

			self.wrap = $wrap;
			self.hookDom = option.hookDom;

			/* do something */
			self.outParam = self.applyMethods(self, {
				option : options,
				matchAll : self.matchAll
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

			option.btn.on("click", function(event){
		        self.flag = true;
		        self.matchAll();
		        if ( self.flag ) {
		            if ( typeof(option.success) == "function" ) {
		                option.success(option.btn, event);
		            }
		        } else{
		            if ( typeof(option.error) == "function" ) {
		                option.error(self.errorDom);
		            }
		        }
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
				term = !!_ver ? _ver[1] : ver,
				mapTerm = self.map[term],
				msg = "", doTest;
			// 验证条件存在时
			if ( !!mapTerm) {
				msg = mapTerm.msg && mapTerm.msg.replace("{name}", name);
				// 正则验证时
				if ( !!mapTerm.reg ) {
					if ( mapTerm.reg.test(val) ) {
						// self.verified(dom);
						return true;
					}else{
						self.thrown(dom, msg);
						return false;
					}
				}
				// 函数验证时
				else if ( !!self[term] ) {
					if ( !!_ver ) {
						doTest = self[term](val, msg, dom, _ver[2]);
					}else{
						doTest = self[term](val, msg, dom, term);
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
				// // 函数验证时
				// if ( !!term.fun ) {
				// }
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
	    	self.errorDom = dom;
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
	    waiting : function(dom){
	    	var self = this,
	    		temp = "";
	        dom.nextAll(".Js-verification-state").remove();
	        if ( self.option.errorTemp != null) {
	            temp = self.option.errorTemp(msg);
	        }else{
	            temp = '<a href="javascript:void(0);" class="state right Js-verification-state">waiting...</a>';
	        }
	        var $nextAll = dom.nextAll();
	        if ( $nextAll.length ) {
	            $nextAll.last().after(temp);
	        } else{
	            dom.after(temp);
	        }
	    },
	    numLast : function(val, msg, dom, range){
	    	var self = this,
	            valMin = range.split("-")[0],
	            valMax = range.split("-")[1],
	            _reg = new RegExp('^\\d+(\\.\\d{' + valMin + ',' + valMax + '})$'),
	        	_msg = msg.replace("{range}", range);
	        if(_reg.test(val)) {
	            return { result : true, msg : _msg };
	        } else {
	            return { result : false, msg : _msg };
	        }
	    },
	    numRange : function(val, msg, dom, range){
	    	var self = this,
	            strMin = range.split("-")[0],
            	strMax = range.split("-")[1],
	        	_val = parseFloat(val),
	        	_msg = msg.replace("{range}", range);
	        if(_val >= valMin && _val <= valMax) {
	             return { result : true, msg : _msg };
	        } else {
	            return { result : false, msg : _msg };
	        }
	    },
	    strRange : function(val, msg, dom, range){
	    	var self = this,
	            strMin = range.split("-")[0],
            	strMax = range.split("-")[1],
	            _reg = new RegExp('^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]{' + strMin + ',' + strMax + '}$'),
	        	_msg = msg.replace("{range}", range);
	        if( _reg.test(val) ) {
	            return { result : true, msg : _msg };
	        } else {
	            return { result : false, msg : _msg };
	        }
	    },
	    isHave : function(val, msg, dom, range){
	    	var self = this,
	    		_ajax;
	    	if ( !self.ajaxQueue.isHave ) {
				self.ajaxQueue.isHave = {};
				self.ajaxQueue.isHave.length = 0;
			}
			self.ajaxQueue.isHave.length++;
			_ajax = self.ajaxQueue.isHave.length;
	    	self.ajaxQueue.isHave[_ajax] = cgClass.Ajax({
	    		url : "api/area.txt",
	    		type: "get",
	    		dataType: "textJson",
	    		queue : "isHave",
	    		beforeSend : function(xhr, ajax){},
	    		queueCallback : function(){},
	    		success: function( result, statusText ){
	    			self.ajaxQueue.isHave.length--;
	    			self.ajaxQueue.isHave[_ajax] = null;
	    			if ( result.success ) {
	    				// self.verified(dom);
	    			} else{
	    				self.thrown(dom, msg);
	    				self.abortAjax();
	    				// console.log(self.ajaxQueue.isHave);
	    			}
	    		},
	    		error: function( result, statusText, error ){
	    			self.ajaxQueue.isHave.length--;
	    			self.ajaxQueue.isHave[_ajax] = null;
	    		}
	    	});
	    	return { result : "ajax", msg : msg };
	    },
	    abortAjax : function(){
	    	var self = this;
	    	$.each(self.ajaxQueue, function(key, item){
    			for(var i = 0; i < item.length; i++ ){
    				if (!!item[i+1]) {
    					item[i+1].abort();
    				}
    			}
	    	});
	    	self.flag = false;
	    },
	    matchAll : function(){
	    	var self = this;
	    	self.flag = true;
	    	self.wrap.find(self.hookDom).each(function(){
	    		$(this).blur();
	    		if ( !self.flag ) {
	    			self.doError();
	    			return false;
	    		}
	    	});
	    },
	    doError : function(){
	    	console.log("match add error");
	    }
	}
);
cgClass.ajaxQueueCallback.ver = function(){
	console.log("finish");
}
