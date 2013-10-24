cgClass.AddClass(
	"Popup",
	{
		init : function (options) {
			var self = this,
				$layer, $popup, $close, $con, $error, $btnWrap, $done, $cancel,
				option = $.extend({
					title: "提示",
			        popupTemp : null,
			        template : "",
			        addClass : "",
			        isLayer : true,
			        isCenter : true,
			        isOnly : false,
			        autoShow : true,
			        append : {
			            isAppend : false,
			            dom : $(".dom")
			        },
			        hasBtn : true,
			        hasCancel : true,
			        content :null,
			        done :null,
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
		    }).on("click", ".Js-popup-done", function() {
		    	if ( option.hasBtn && !$(this).hasClass("popup-btn-disabled") && typeof(option.done) == "function" ) {
		            option.done(self.outParam);
		    	}
		    	return false;
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
		    if ( option.isCenter ) {
		        $(window).resize(function(){
		            self.positionCenter();
		        });
		    }
		    if ( option.autoShow ) {
		    	self.show();
		    }
		},
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
		show : function(callback){
			var self = this;
			self.positionCenter();
			self.popup.show();
			if (Modernizr.csstransitions) {
				self.popup.addClass("fadeInDown").delay(800).show(0, function(){$(this).removeClass("fadeInDown");});
			}
			if ( typeof callback == "function" ) {
				callback(self.outParam);
			}
		},
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
		showTip : function(str){
			self.con.append(self.error);
		    self.error.html(str);
		},
		removeTip : function(){
			self.error.hide();
		},
		reset : function(){
			self.con.html(self.template);
		},
		disableBtn : function(){}
	}
);
