/**
 * @author 徐晨 
 * @name cgClass.Verification
 * @class 验证插件 <a href="../demo/verification-register.html" target="_blank">demo</a>
 * @constructor
 * @extends cgClass
 * @extends jQuery
 * @since version 1.0 
 * @param {Object} options 参数对象数据
 * @param {jQuery Object} options.wrap 需要验证的表格包裹的jquery dom
 * @param {css class} options.hookDom 被验证项的钩子名称
 * @param {css class} options.inputWrap 被验证项的单行包裹，提示验证结果用
 * @param {Object} options.map 附加验证条件
 * @param {jQuery Object} options.btn 触发提交事件的按钮
 * @param {Object} options.parseAjaxData 附加ajax data
 * @param {Function} options.successTemp 返回成功提示的html片段
 * @param {Function} options.errorTemp 返回错误提示的html片段
 * @param {css class} options.otherInput 特殊input的钩子名称
 * @param {Function} options.init 验证前的附加事件
 * @param {Function} options.error 验证错误时候的附加事件
 * @param {Function} options.success 验证成功时候的附加事件
 */
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
			        otherInput : ".other",
			        init : function(){},
			        error : function(){},
			        success : function(){}
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
			self.verLength = 0;
			self.vering = false;
	        self.flag = true;
	        self.ajaxFinish = true;
	        self.errorDom = null;
			self.ajaxQueue = { length : 0};
			self.option = option;
			if ( !!option.map ) {
				self.map = $.extend(self.map, option.map);
			}

			var $wrap = option.wrap;

			self.wrap = $wrap;
			self.hookDom = option.hookDom;
			self.inputWrap = option.inputWrap;

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
							val = val ? val : "";
						break;
						case "checkbox":
							var $checkbox = $wrap.find(":checkbox[name=" + $dom.attr("name") + "]");
							val = $checkbox.filter(":checked").length;
							val = val ? val : "";
						break;
						default:
							val = $dom.val();
						break;
					}
				}else if ( tagName == "SELECT" ) {
					switch(tagType){
						case "select-one":
							val = $dom.val();
						break;
						case "select-multiple":
							val = !$dom.children().length ? "" : "has";
						break;
						default:
						break;
					}
				}else{
					var testType = $dom.attr("data-type"),
						testInputType = $dom.attr("data-input-type");
					if ( testType == "notText" ) {
						switch( testInputType ){
		                    case "select" :
		                    	var $select = $dom.find("select").first();
		                        val = $select.val();
		                        $dom = $select;
		                    break;
		                    case "other" :
		                    	var $other = $dom.find(option.otherInput);
		                        val = $other.val();
		                        $dom = $other;
		                    break;
		                    default :
		                    	var $other = $dom.find("input:checked");
		                        val = $other.length ? $other.length : "";
		                        $dom = $other.last();
		                    break;
		                };
					}
				}
				self.parseVer(dataVer, val, $dom);
			});

			option.btn.on("click", function(event){
		        self.flag = true;
		        self.vering = true;
		        self.matchAll(event);
		        if ( !self.ajaxQueue.length ) {
		        	self.doMatchResult(event)
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
						self.verified(dom);
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
						doTest.result != "ajax" && self.verified(dom);
					}else{
						self.thrown(dom, doTest.msg);
					}
					return doTest.result;
				}else{
					// 附加函数验证
					if ( !!term.fun ) {
						doTest = term.fun(val, msg, dom, term);
						if ( !!doTest.result ) {
							doTest.result != "ajax" && self.verified(dom);
						}else{
							self.thrown(dom, doTest.msg);
						}
					}
				}
			}
			else{
				alert("验证信息配置有误，请检查代码");
			}
		},
		verified : function(dom){
	        var self = this,
	    		temp = "";
	    	self.verLength = self.verLength == 0 ? 0 : self.verLength-1;
	        dom.nextAll(".Js-verification-state").remove();
	        if ( self.option.errorTemp != null) {
	            temp = self.option.errorTemp(msg);
	        }else{
	            temp = '<a href="javascript:void(0);" class="state right Js-verification-state">&nbsp;</a>';
	        }
	        dom.closest(self.inputWrap).append(temp);
	    },
	    thrown : function(dom, msg){
	    	var self = this,
	    		temp = "";
    		self.vering = false;
    		self.flag = false;
	    	self.verLength = self.verLength == 0 ? 0 : self.verLength-1;
	    	self.errorDom = dom;
	        dom.nextAll(".Js-verification-state").remove();
	        if ( self.option.errorTemp != null) {
	            temp = self.option.errorTemp(msg);
	        }else{
	            temp = '<a href="javascript:void(0);" class="state error Js-verification-state">' + msg + '</a>';
	        }
	        dom.closest(self.inputWrap).append(temp);
	    },
	    waiting : function(dom){
	    	var self = this,
	    		temp = "";
	        dom.nextAll(".Js-verification-state").remove();
	        temp = '<a href="javascript:void(0);" class="state right Js-verification-state">waiting...</a>';
	        dom.closest(self.inputWrap).append(temp);
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
	    		_ajax,
	    		_ajaxUrl = dom.attr("data-same-url"),
	    		_ajaxData = {
                    label : val,
                    id : dom.attr("data-same-id") == "" ? "" : dom.attr("data-same-id")
                };
	    	if ( !self.ajaxQueue.isHave ) {
	    		self.ajaxQueue.length++;
				self.ajaxQueue.isHave = {};
				self.ajaxQueue.isHave.length = 0;
			}
			self.ajaxQueue.isHave.length++;
			_ajax = self.ajaxQueue.isHave.length;
	    	self.ajaxQueue.isHave[_ajax] = cgClass.Ajax({
	    		url : _ajaxUrl,
	    		type: "get",
	    		data : _ajaxData,
	    		dataType: "textJson",
	    		queue : "isHave",
	    		beforeSend : function(xhr, ajax){
	    			self.waiting(dom);
	    		},
	    		queueCallback : function(){
	    			if ( self.ajaxQueue.isHave.length == 0 ) {
	    				self.ajaxQueue.isHave = null;
	    				self.ajaxQueue.length--;
	    				if ( self.vering ) {
	    					self.doMatchResult(dom.data("ev"));
	    				}
	    				return true;
	    			}
	    		},
	    		success: function (result, statusText) {
	    			self.ajaxQueue.isHave.length--;
	    			self.ajaxQueue.isHave[_ajax] = null;
	    			if ( result.success ) {
	    				self.verified(dom);
	    			} else{
	    				self.thrown(dom, msg);
	    				self.abortAjax();
	    			}
	    		},
	    		error: function( result, statusText, error ){
	    			self.ajaxQueue.isHave.length--;
	    			self.ajaxQueue.isHave[_ajax] = null;
	    			self.thrown(dom, "验证超时，请重新尝试");
    				self.abortAjax();
	    		}
	    	});
	    	return { result : "ajax", msg : msg };
	    },
	    abortAjax : function(){
	        var self = this,
                thisQueue = self.ajaxQueue;
	        for (var key in thisQueue) {
	            if (key != "length") {
	                for (var i = 0; i < thisQueue[key].length; i++) {
	                    if (!!thisQueue[key][i + 1]) {
	                        thisQueue[key][i + 1].abort();
	                    }
	                }
	            }
	        }
	    	self.flag = false;
	    },
	    matchAll : function(event){
	    	var self = this;
	    	self.verLength = self.wrap.find(self.hookDom).length;
	    	self.flag = true;
	    	self.wrap.find(self.hookDom).each(function(){
	    		$(this).data("ev", event);
	    		if ( self.flag ) {
	    			$(this).blur();
	    		}
	    	});
	    },
	    doMatchResult : function(event){
	    	var self = this;
	    	self.vering = false;
	    	if ( self.ajaxQueue.length == 0 ) {
	    		if ( self.flag && self.ajaxFinish ) {
		            if ( typeof(self.option.success) == "function" ) {
		                self.option.success(self.option.btn, event);
		            }
		        } else{
		            if ( typeof(self.option.error) == "function" && !!self.errorDom ) {
		                self.option.error(self.errorDom);
		                self.errorDom = null;
		            }
		        }
	    	}
	    }
	}
);
