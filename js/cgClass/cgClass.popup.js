cgClass.AddClass(
	"Popup",
	{
		init : function (options) {
			var self = this,
				option = $.extend({
					title: "提示",
			        popupTemp : null,
			        template : "",
			        addClass : "",
			        isLayer : true,
			        isCenter : true,
			        isOnly : false,
			        append : {
			            isAppend : false,
			            dom : $(".dom")
			        },
			        // hasError : false,
			        hasBtn : true,
			        hasCancel : true,
			        content : function(option){},
			        done : function(option){},
			        cancel : function(option){}
				}, options);
			if ( option.template == "" ) {
		        return false;
		    }
		    self.option = option;

		    var $popup = option.popupTemp || $('<div class="module-popup fn-clear Js-popup-wrap">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
				    '<div class="popup-con Js-popup-con"></div>'+
				    '<div class="btn-wrap Js-popup-btn-wrap">'+
				    	'<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
            			'<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
				    '</div>'+
				'</div>');

		    var $error = $('<ul class="result-tips-error result-tips"></ul>');

		    if ( option.isLayer ) {
		        var $layer = $("<div class='module-popup-layer'></div>");
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
		    // if ( option.hasError ) {
		    //     $popup.find(".Js-popup-btn-wrap").after($error);
		    // }
		    // add new class
		    if ( option.addClass ) {
		        $popup.addClass(option.addClass);
		    }
		    var $mainWrap = $popup.find(".Js-popup-main-wrap"),
		        $btnWrap = $popup.find(".Js-popup-btn-wrap"),
		        $btnDone = $btnWrap.find(".Js-popup-done"),
		        $btnCancel = $btnWrap.find(".Js-popup-cancel"),
		        $btnClose = $popup.find(".Js-popup-close"),
		        $con = $popup.find(".Js-popup-con"),
		        positionCenter = function(){
		            var objWidht = $popup.width(),
		                objHeight = $popup.height();
		            $popup.css( { "margin-left" : "-" + objWidht / 2 + "px" } );
		        };
		    // out param
		    $.extend(option, {
		        oPopup : $popup,
		        oBtnWrap : $btnWrap,
		        oBtnDone : $btnDone,
		        oBtnCancel : $btnCancel,
		        oBtnClose : $btnClose,
		        oCon : $con,
		        oTip : $error,
		        close : function(){
		            $popup.remove();
		            if ( option.isLayer ) {
		                $layer.remove();
		            }
		        },
		        showTip : function(str){
		            // $mainWrap.append($error);
		            $popup.append($error);
		            $error.html(str);
		        },
		        removeTip : function(str){
		            $error.remove();
		        },
		        disableBtn : function(disable){
		            if (disable) {
		                option.oBtnDone.prop("disabled", true);
		            }else{
		                option.oBtnDone.prop("disabled", false);
		            }
		        }
		    });
		    // self.outParam = {
		    // 	oPopup : $popup,
		    // 	close : function(){
		    // 		self.close.apply(self, arguments);
		    // 	}
		    // };

		    self.applyMethods(self, {
				option : option,
				oPopup : $popup,
				layer : $layer,
				message : "hello world",
				close : self.close,
				open : self.close
			});

			// self.close();

		    // append content template
		    $con.append(option.template);

		    $popup.show();
		    // bind popup init function
		    if ( typeof(option.content) == "function" ) {
		        option.content( self.outParam );
		    }

		    if ( option.hasBtn ) {
		        $btnDone.on("click", function(){
		            if ( typeof(option.done) == "function" && !$(this).prop("disabled") ) {
		                option.done(option);
		            }
		        });
		        if ( option.hasCancel ) {
		            $btnCancel.on("click", function(){
		                if ( typeof(option.cancel) == "function" ) {
		                    option.cancel(option);
		                }
		                self.close();
		            });
		            $btnClose.on("click", function(){
		                $btnCancel.click();
		            });
		        } else{
		            $btnCancel.remove();
		            $btnClose.on("click", function(){
		                self.close();
		            });
		        }
		    }else{
		        $btnWrap.remove();
		        $btnClose.on("click", function(){
		            if ( typeof(option.done) == "function" ) {
		                option.done(option);
		            }
		            self.close();
		        });
		    }

		    // bind wrap position
		    if ( option.isCenter ) {
		        positionCenter();
		        $(window).resize(function(){
		            positionCenter();
		        });
		    }

		},
		close : function(){
			var self = this;
			self.outParam.oPopup.remove();
			if ( self.outParam.option.isLayer ) {
                self.outParam.layer.remove();
            }
		}
	}
);
