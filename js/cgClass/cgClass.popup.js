/**
 * @author 徐晨 
 * @name cgClass.Popup
 * @class 弹出框
 * @constructor
 * @extends cgClass
 * @extends Modernizr
 * @extends jQuery
 * @since version 0.1 
 * @param {Object} options 参数对象数据
 * @param {String} options.title 弹出框的标题
 * @param {jQuery Object} options.popupTemp 弹出框html的jQuery对象
 * @param {html} options.template 内容区的html代码片段
 * @param {css class} options.addClass 附加弹出框样式
 * @param {Boolean} options.isLayer 是否需要遮罩层
 * @param {Boolean} options.isCenter 是否居中
 * @param {Boolean} options.isOnly 是否为唯一
 * @param {Boolean} options.autoShow 是否在初始化时自动显示弹出框
 * @param {Object} options.append 是否在目标对象中加载
 * @param {Boolean} options.append.isAppend 是否在目标对象中加载
 * @param {jQuery Object} options.append.dom 目标对象的jquery dom
 * @param {Boolean} options.hasBtn 是否需要按钮
 * @param {Boolean} options.hasCancel 是否需要取消按钮
 * @param {Function} options.content 内容区的附加函数
 * @param {Function} options.done 确定按钮的附加函数
 * @param {Function} options.cancel 取消按钮的附加函数
 * @example var newInstance = new cgClass.Create(
	"className",
	{
		arg : "value",
		method : function(){}
	}
); 
 * @example cgClass.Create(
	"className",
	{
		arg : "value",
		method : function(){}
	}
); 
 * @example cgClass.Create(
	"className",
	{
		arg : "value"
	},
	function(self){
		self.doMethods();
	}
); 
 */
cgClass.AddClass(
	"Popup",
	{
		init : function (options) {
			var self = this,
				$layer, $popup, $close, $con, $error, $btnWrap, $done, $cancel,
				option = $.extend(/** @lends cgClass.Popup.prototype*/{
					/**
			         * 弹出框的标题
			         * @type String
			         * @default "提示"
			         */
					title: "提示",
					/**
			         * 弹出框html的jQuery对象
			         * @type jQuery Dom
			         * @default null
			         */
			        popupTemp : null,
			        /**
			         * 内容区的html代码片段
			         * @type html str
			         * @default ""
			         */
			        template : "",
			        /**
			         * 附加弹出框样式
			         * @type css class
			         * @default ""
			         */
			        addClass : "",
			        /**
			         * 是否需要遮罩层
			         * @type Boolean
			         * @default true
			         */
			        isLayer : true,
			        /**
			         * 是否居中
			         * @type Boolean
			         * @default true
			         */
			        isCenter : true,
			        /**
			         * 是否唯一
			         * @type Boolean
			         * @default false
			         */
			        isOnly : false,
			        /**
			         * 是否在初始化时自动显示
			         * @type Boolean
			         * @default true
			         */
			        autoShow : true,
			        /**
			         * 以添加的方式初始化弹出框 isAppend: 是否以添加的方式初始化弹出框; dom: 包裹对象
			         * @type Object
			         * @default isAppend : false, dom : $(".dom")
			         */
			        append : {
			            isAppend : false,
			            dom : $(".dom")
			        },
			        /**
			         * 是否需要按钮
			         * @type Boolean
			         * @default true
			         */
			        hasBtn : true,
			        /**
			         * 是否需要取消按钮
			         * @type Boolean
			         * @default true
			         */
			        hasCancel : true,
			        /**
			         * 内容区的附加函数
			         * @type Function
			         * @param {Object} opt 外部调用对象
			         * @default null
			         */
			        content :null,
			        /**
			         * 确定按钮附加函数
			         * @type Function
			         * @param {Object} opt 外部调用对象
			         * @default null
			         */
			        done :null,
			        /**
			         * 取消按钮附加函数
			         * @type Function
			         * @param {Object} opt 外部调用对象
			         * @default null
			         */
			        cancel :null
				}, options);
			if ( option.template == "" ) {
		        return false;
		    }
		    self.option = option;

		    self.popup = $popup = option.popupTemp || $('<div class="module-popup fn-clear Js-popup-wrap">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
				    '<div class="popup-con Js-popup-con"></div>'+
				    '<div class="popup-btn-wrap Js-popup-btn-wrap">'+
				    	'<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
            			'<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
				    '</div>'+
				'</div>');

		    self.error = $error = $('<ul class="popup-tips"></ul>');

		    if ( option.isLayer ) {
		        self.layer = $layer = $("<div class='module-popup-layer'></div>");
		        $("body").append($layer);
		    }
		    if ( option.isOnly ) {
		        $(".module-popup-layer").remove();
		        $(".Js-popup-wrap").remove();
		    }
		    if ( option.append.isAppend ) {
		        option.append.dom.append( $popup );
		    } else{
		        $("body").append( $popup );
		    }
		    // add new class
		    if ( option.addClass ) {
		        $popup.addClass(option.addClass);
		    }
		    self.template = option.template;
		    self.btnWrap = $btnWrap = $popup.find(".Js-popup-btn-wrap");
	        self.btnDone = $done = $btnWrap.find(".Js-popup-done");
	        self.btnCancel = $cancel = $btnWrap.find(".Js-popup-cancel");
	        self.btnClose = $close = $popup.find(".Js-popup-close");
	        self.con = $con = $popup.find(".Js-popup-con");
		    // out param
		    self.outParam = self.applyMethods(self, {
				oPopup : $popup,
		        oBtnWrap : $btnWrap,
		        oBtnDone : $done,
		        oBtnCancel : $cancel,
		        oBtnClose : $close,
				oLayer : $layer,
				show : self.show,
				hide : self.hide,
				close : self.close,
				reset : self.reset,
				showTip : self.showTip,
				removeTip : self.removeTip
			});

		    // append content template
		    $con.append(option.template);

		    // bind popup init function
		    if ( typeof(option.content) == "function" ) {
		        option.content( self.outParam );
		    }
		    // bind btn close method
		    $popup.on("click", ".Js-popup-close", function() {
		    	if ( option.hasBtn ) {
		    		if ( option.hasCancel && typeof(option.cancel) == "function" ) {
		                option.cancel(self.outParam);
		    		} else{
		    			self.close();
		    		}
		    	} else{
		    		if ( typeof(option.done) == "function" ) {
		                option.done(self.outParam);
		            } else{
		    			self.close();
		    		}
		    	}
		    // bind btn done method
		    }).on("click", ".Js-popup-done", function() {
		    	if ( option.hasBtn && !$(this).hasClass("popup-btn-disabled") && typeof(option.done) == "function" ) {
		    		self.disableBtn();
		            option.done(self.outParam);
		    	}
		    	return false;
		    // bind btn cancel method
		    }).on("click", ".Js-popup-cancel", function() {
		    	if ( typeof(option.cancel) == "function" ) {
                    option.cancel(self.outParam);
                }else{
                	self.close();
                }
		    });

		    if ( option.hasBtn ) {
		        if ( !option.hasCancel ) {
		            $cancel.remove();
		        }
		    }else{
		        $btnWrap.remove();
		    }

		    // bind wrap position
		    if ( option.isCenter && !option.append.isAppend ) {
		        $(window).resize(function(){
		            self.positionCenter();
		        });
		    }
		    if ( option.autoShow ) {
		    	self.show();
		    }
		},
		/**
		 * @name cgClass.popup#positionCenter
		 * @desc  使弹出框居中
		 * @event
		 */
		positionCenter : function(){
			var self = this,
				width = self.popup.width(),
                height = self.popup.height();
            self.popup.css({
            	"position" : "fixed",
            	"top" : "40%",
            	"left" : "50%",
            	"margin" : "-" + height / 2 + "px 0 0 -" + width / 2 + "px" 
        	});
		},
		/**
		 * @name cgClass.popup#show
		 * @desc  显示弹出框
		 * @event
		 * @param {Function} callback 回调函数
		 */
		show : function(callback){
			var self = this;
			self.positionCenter();
			if ( self.option.isLayer ) {
                self.layer.show();
            }
			self.popup.show();
			if (Modernizr.csstransitions) {
				self.popup.addClass("fadeInDown").delay(800).show(0, function(){$(this).removeClass("fadeInDown");});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
		/**
		 * @name cgClass.popup#hide
		 * @desc  隐藏弹出框
		 * @event
		 * @param {Function} callback 回调函数
		 */
		hide : function(callback){
			var self = this;
			if ( self.option.isLayer ) {
                self.layer.hide();
            }
			if (!Modernizr.csstransitions) {
				self.popup.hide();
			}else{
				self.popup.addClass("fadeOutUp").delay(800).hide(0, function(){$(this).removeClass("fadeOutUp");});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
		/**
		 * @name cgClass.popup#close
		 * @desc  关闭弹出框
		 * @event
		 * @param {Function} callback 回调函数
		 */
		close : function(callback){
			var self = this;
			if ( self.option.isLayer ) {
                self.layer.remove();
            }
            if (!Modernizr.csstransitions) {
				self.popup.remove();
			}else{
				self.popup.addClass("fadeOutUp").delay(700).hide(0, function(){
					self.popup.remove();
				});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
		/**
		 * @name cgClass.popup#showTip
		 * @desc  显示错误信息
		 * @event
		 * @param {String} str 错误信息的字符串
		 */
		showTip : function(str){
			var self = this;
			self.con.append(self.error);
		    self.error.html(str);
		},
		/**
		 * @name cgClass.popup#removeTip
		 * @desc  隐藏错误信息
		 * @event
		 */
		removeTip : function(){
			this.error.hide();
		},
		/**
		 * @name cgClass.popup#reset
		 * @desc  重置内容区内容
		 * @event
		 */
		reset : function(){
			var self = this;
			self.con.html(self.template);
		},
		/**
		 * @name cgClass.popup#disableBtn
		 * @desc  改变确定按钮状态
		 * @event
		 * @param {Boolean} isReset 为true时确定按钮可用，反之不可用
		 */
		disableBtn : function(isReset){
			var self = this;
			if ( isReset ) {
				self.btnDone.removeClass("popup-btn-disabled");
			} else{
				self.btnDone.addClass("popup-btn-disabled");
			}
		}
	}
);
