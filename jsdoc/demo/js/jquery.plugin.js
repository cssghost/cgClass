(function($){
/*******************************************************************************************************
 *	baiing View : $.cgPopup()	弹出框 * 为必填
 *	@param [options:title(str)]			*title text
 *	@param [options:template(html)]		*content html
 *	@param [options:addClass(str)]		popup new class
 *	@param [options:isLayer(bool)]		if true, add mask layer
 *	@param [options:hasBtn(bool)]		if false, all button hide without close button
 *	@param [options:hasCancel(bool)]	if false, cancel button hide
 *	@param [options:content(fun)]		content function
 *	@param [options:done(fun)]			*done function
 *	@param [options:cancel(fun)]		cancel function
 ********************************************************************************************************
 *	@param [out:oPopup($dom)]			dom : popup
 *	@param [out:oBtnWrap($dom)]			dom : popup wrap
 *	@param [out:oBtnDone($dom)]			dom : popup done button
 *	@param [out:oBtnCancel($dom)]		dom : popup cancel button
 *	@param [out:oBtnClose($dom)]		dom : popup close button
 *	@param [out:oCon($dom)]				dom : popup content
 *	@param [out:close(fun)]				action : close popup
 ********************************************************************************************************/
$.cgPopup = function(options){
    var option = $.extend({
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
    var $popup = $('<div class="module-popup fn-clear Js-popup-wrap">'+
				  // '<div class="popup-wrap fn-clear">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
				    '<div class="popup-con Js-popup-con"></div>'+
				    '<div class="btn-wrap Js-popup-btn-wrap">'+
				    	// '<input type="button" class="popup-btn input-btn Js-popup-done" value="确定">'+
				    	// '<input type="button" class="popup-btn input-btn Js-popup-cancel" value="取消">'+
				    	'<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
            			'<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
				    '</div>'+
				  // '</div>'+
				'</div>');
    $popup = option.popupTemp || $popup;
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
    // append content template
    $con.append(option.template);

    $popup.show();
    // bind popup init function
    if ( typeof(option.content) ) {
        option.content(option);
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
                option.close();
            });
            $btnClose.on("click", function(){
                $btnCancel.click();
            });
        } else{
            $btnCancel.remove();
            $btnClose.on("click", function(){
                option.close();
            });
        }
    }else{
        $btnWrap.remove();
        $btnClose.on("click", function(){
            if ( typeof(option.done) == "function" ) {
                option.done(option);
            }
            option.close();
        });
    }

    // bind wrap position
    if ( option.isCenter ) {
        positionCenter();
        $(window).resize(function(){
            positionCenter();
        });
    }
};

}(jQuery));