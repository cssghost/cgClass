(function($){

// NEW selector
jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
//$.fn
$.fn.extend({
	/*******************************************************************************************************
	*	common View : $().mousewheel()	模拟鼠标滚轮
	********************************************************************************************************/
	mousewheel : function(Func) {
		return this.each(function() {
			var _self = this;
			_self.D = 0;
			//滚动方向
			if(document.all || window.chrome) {
				_self.onmousewheel = function() {
					_self.D = event.wheelDelta;
					event.returnValue = false;
					Func && Func.call(_self);
				};
			} else {
				_self.addEventListener("DOMMouseScroll", function(e) {
					_self.D = e.detail > 0 ? -1 : 1;
					e.preventDefault();
					Func && Func.call(_self);
				}, false);
			}
		});
	},
	/*******************************************************************************************************
	*	common View : $().selection()	获取输入框光标位置
	********************************************************************************************************/
	selection: function(start, end){
		var elem = this[0],
			points = {};

		if(!/^\d+$/.test(start)){
            if(elem.setSelectionRange){
                points.start = elem.selectionStart;
                points.end = elem.selectionEnd;
            }
            else if (document.selection){
              	var textRange = document.selection.createRange();
					if (textRange.text.length > 0){
						points.start = elem.value.indexOf(textRange.text);
						textRange.moveStart ('character', -elem.value.length);
						points.end = textRange.text.length;
					}
					else{
						textRange.moveStart ('character', -elem.value.length);
						points.start = textRange.text.length;
						points.end = points.start;
					}
            }
            else{
                points.start = 0;
                points.end = 0;
            }
			return points;
		}
		else{
			points.start = (start && /^\d+$/.test(start))? start: 0;
			points.end = (end && /^\d+$/.test(end))? end: points.start;

            if(elem.setSelectionRange){
                elem.setSelectionRange(points.start, points.end);  
            }
            else if(elem.createTextRange){
            	var range = elem.createTextRange();
        			range.collapse(true);
        			range.moveEnd('character', points.end);
        			range.moveStart('character', points.start);
        			range.select();
            }
            return $(elem);
		}

	},
	/*******************************************************************************************************
	*	baiing View : $().cgCommonText()	输入框，浏览器不支持placeholder模拟placeholder效果
	*	@param [options:fontClass]	 模拟placeholder的字体颜色样式
	*	@param [options:focusParent]	 改变text获得焦点时的样式 取dom的data-focus属性值
	********************************************************************************************************/
	cgCommonText : function(options){
		var option = {
			fontClass : "font-ccc",
			focusParent : "",
			clearBtn : ".input-clear-btn"
		};
		$.extend(option, options);
		var _support = (function() {
	        return 'placeholder' in document.createElement('input');
	    })();
	    return this.each(function(){
	    	var $text = $(this),
	    		focusClass = "",
	    		$textWrap = $text.closest(option.focusParent),
	    		$clearBtn = $textWrap.find(option.clearBtn);
	    	if ( option.focusParent != "" ) {
				focusClass = $textWrap.attr("data-focus");
			} else{
				focusClass = $(this).attr("data-focus");
			}
		    if ( !_support ) {
		    	var _strText = $text.attr("placeholder"),
		    		$clone = $("<input type='text' />");
		    	if ( !$text.is(":password") ) {
		    		if ( $text.val() == "" ) {
		    			$text.addClass(option.fontClass).val(_strText);
		    		}else if ( $text.val() == _strText ) {
						$text.addClass(option.fontClass)
		    		}
		    		$text.focus(function(){
		    			if ( $.trim( $text.val() ) == _strText ) {
		    				$text.removeClass(option.fontClass).val("");
		    			}else{
		    				$text.select();
		    			}
		    		}).blur(function(){
		    			if ( $.trim( $text.val() ) == "" ) {
		    				$text.addClass(option.fontClass).val(_strText);
		    			}
		    		});
		    	}
		    	// not input:password
		    	else{
		    		if ( $text.val() == "" ) {
		    			$text.hide().after($clone);
			    		$clone.attr("class", $text.attr("class")).addClass(option.fontClass).val(_strText);
		    		}
		    		$clone.focus(function(){
		    			$clone.hide();
		    			$text.show().focus();
		    		});
		    		$text.blur(function(){
		    			if ( $.trim( $text.val() ) == "" ) {
		    				$clone.show();
		    				$text.hide();
		    			}
		    		});
		    	}
		    }
		    $text.focus(function(){
		    	var _val = $(this).val();
				if ( option.focusParent != "" ) {
					$textWrap.addClass(focusClass);
				}else{
					$text.addClass(focusClass);
				}
				if ( _val.length ) {
					$clearBtn.show();
				}else{
					$clearBtn.hide();
				}
			}).blur(function(){
				if ( option.focusParent != "" ) {
					$textWrap.removeClass(focusClass);
				}else{
					$text.removeClass(focusClass);
				}
			}).keyup(function(){
				var _val = $(this).val();
				if ( _val.length ) {
					$clearBtn.show();
				}else{
					$clearBtn.hide();
				}
			});

			$clearBtn.on("click", function(){
				$text.val("");
				$(this).hide();
			});
	    });
	},
    /*******************************************************************************************************
     *  baiing View : $().cgImitatePlaceholder()    输入框，浏览器不支持placeholder模拟placeholder效果
     *  @param [options:fontClass]   模拟placeholder的字体颜色样式
     *  @param [options:focusParent]     改变text获得焦点时的样式 取dom的data-focus属性值
     ********************************************************************************************************/
    cgImitatePlaceholder : function(options){
        var option = {
            addClass : ""
        };
        $.extend(option, options);
        var _support = (function() {
            return 'placeholder' in document.createElement('input');
        })();
        return this.each(function(){
            var $text = $(this),
                $label = $("<label></label>");
            if ( !_support ) {
                var _strText = $text.attr("placeholder"),
                    $parent = $text.parent();
                if ( $parent.css("position") == "static" ) {
                    $parent.css("position", "relative");
                }
                var _position = $text.position();
                $text.after( $label.text(_strText).css({ position : "absolute", left : _position.left, top : _position.top }) );
                if (option.addClass.length) {
                    $label.addClass(option.addClass);
                }
            }
            $label.click(function(){
                $(this).animate({ opacity : 0.5 }, "fast");
                $text.focus().click();
            })
            $text.change(function(){
                if ( $.trim( $(this).val() ) != "" && $label.is(":visible") ) {
                    $label.hide();
                }
            }).keyup(function(){
               if ( $.trim( $(this).val() ) != "" && $label.is(":visible") ) {
                    $label.hide();
                } 
            }).focus(function(){
               if ( $.trim( $(this).val() ) != "" && $label.is(":visible") ) {
                    $label.hide();
                } 
            }).blur(function(){
                if ( $.trim( $(this).val() ) == "" ) {
                    $label.text(_strText).show().animate({ opacity : 1 }, "fast");
                }
            });
        });
    },
	/*******************************************************************************************************
	*	cgUI View : $().cgSetNum()	input验证只能填写数字 * 为必填
	*	@param [options]	 change : 值改变时的回调函数
	*	@param [options]	 edit : 修改后触发change
	*	@param [options]	 out : 失去焦点时触发change
	********************************************************************************************************/
	cgSetNum : function(options){
		var option = {
				up : null,
				down : null,
				change : null,
				edit : null,
				out : null,
				initNum : null
			};
		$.extend(option, options);
		return this.each(function(){
			var $this = $(this),
				$setBox = $this.next(".set-num"),
				$setUp = $setBox.find(".set-num-up"),
				$setDown = $setBox.find(".set-num-down");
			$.extend( option, { textBox : $this } );
			// set up
			$setUp.off("click").on("click", function(){
				$this.val( parseInt( $this.val() ) + 1 );
				if( typeof(option.up) == "function" ){
					option.up(option);
				}
				if( typeof(option.change) == "function" ){
					option.change(option);
				}
			});
			// set down
			$setDown.off("click").on("click", function(){
				if ($this.val() > 1) {
					$this.val( $this.val() - 1 );
					if( typeof(option.down) == "function" ){
						option.down(option);
					}
					if( typeof(option.change) == "function" ){
						option.change(option);
					}
				}
			});
			$this.off("keydown,keyup,blur").on("keydown", function(event){
				var key = event.keyCode;
				if( ( key > 47 && key < 58 ) || ( key > 94 && key < 106 ) || key == 8 || key == 13){
					if(key == 13){
						$(this).blur();
					}
					return;
				}else{
					return false;
				}
			}).on("keyup", function(){
				if( typeof(option.edit) == "function" ){
					option.edit(option);
				}
			}).on("blur", function(){
				var val = $.trim( $(this).val() );
				// if ( !/\s/.test( val ) ) {
				// 	$(this).val("");
				// }
				if ( option.initNum != null ) {
					if(option.initNum.constructor === RegExp){
						if ( !option.initNum.test(val) ) {
							$(this).val("");
						}
					}
				}else{
					if ( val < 1 ) {
						$(this).val(0);
					}
				}
				if( typeof(option.out) == "function" ){
					option.out(option);
				}
			});
		});
	},
	/*******************************************************************************************************
	*	cgUI View : $().cgDelayInput()	input延时输入 * 为必填
	*	@param [options]	 callback : 回调函数
	********************************************************************************************************/
	cgDelayInput : function(options){
		var option = {
				callback : null
			};
		$.extend(option, options);
		return this.each(function(){
			var $text = $(this),
				keys = {
					back: 8,
					enter:  13,
					escape: 27,
					up:     38,
					down:   40
				},keyDate = [];
			$text.off("keyup").on("keyup", function(event){
				var keyCode = event.keyCode;
				keyDate.push((new Date()).getTime());
				var thisTime = keyDate[(keyDate.length - 1)];
				var val = "";
				setTimeout(function(){
					val = $.trim( $text.val() );
					if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
						option.callback(option, val);
					}else if ( val == "" ){
						option.callback(option, val);
					}
				}, 300);
			});
		});
	},
	/*******************************************************************************************************
	*	cgUI View : $().cgChangeRadio()	子类单选 * 为必填
	*	@param [options]	 addClass(*) : 值改变时的回调函数需要添加的样式
	*	@param [options]	 add : 回调函数
	*	@param [options]	 remove : 回调函数
	********************************************************************************************************/
	cgChangeRadio : function(options){
		var option = {
				addClass : null,
				add : null,
				remove : null
			};
		$.extend(option, options);
		return this.each(function(){
			var $this = $(this),
				$radio = $this.children();
			// set up
			$this.on("click", "li", function(){
				var str = val = "";
				if( !$(this).hasClass(option.addClass) ){
					str = $(this).children().text();
					val = $(this).children().attr("data-val");
					$this.children().removeClass(option.addClass);
					$(this).addClass(option.addClass);
					if ( typeof(option.add) == "function" ) {
						option.add({ str : str, val : val });
					}
				}else{
					str = val = "";
					$(this).removeClass(option.addClass);
					if ( typeof(option.remove) == "function" ) {
						option.remove({ str : str, val : val });
					}
				}
				
			});
		});
	},
	/*******************************************************************************************************
	*	cgUI View : $().cgChangeCheck()	子类复选 * 为必填
	*	@param [options]	 addClass(*) : 值改变时的回调函数需要添加的样式
	*	@param [options]	 add : 回调函数
	*	@param [options]	 remove : 回调函数
	********************************************************************************************************/
	cgChangeCheck : function(options){
		var option = {
				addClass : null,
				check : "",
				add : null,
				remove : null
			};
		$.extend(option, options);
		return this.each(function(){
			var $this = $(this),
				$radio = $this.children();
			// set up
			$this.on("click", option.check, function(){
				var str = "";
				if( !$(this).hasClass(option.addClass) ){
					str = $(this).children().text();
					$(this).addClass(option.addClass);
					if ( typeof(option.add) == "function" ) {
						option.add(str, $(this));
					}
				}else{
					str = "";
					$(this).removeClass(option.addClass);
					if ( typeof(option.remove) == "function" ) {
						option.remove(str, $(this));
					}
				}
			});
		});
	},
	/*******************************************************************************************************
	*	baiing View : $.chosenText()	输入框，有搜索人名，添加进入输入框效果 * 为必填
	*	@param [options]	 showList : 显示用的list
	*	@param [options]	 searchList : 检索出来的list
	*	@param [options]	 textBox : 输入框的上级li元素，作为添加选中元素html的标示元素
	*	@param [options]	 text : 输入框
	*	@param [options]	 isSearch : 是需要检索数据 [ true | false ]
	*	@param [options]	 verification : 正则 在isSearch = false 时 使用验证输入内容
	*	@param [options]	 createSearchList : 外部调用函数，生成searchList
	*	@param [options]	 action : 外部调用函数，附加函数用于扩展功能
	*	@param [init function]	 addShowItem : 外部调用函数（受保护函数） 添加选中元素html
	*	@param [init function]	 addSearchItem : 外部调用函数（受保护函数） 添加检索列表元素html
	********************************************************************************************************/
	chosenText : function(options){
		var option = {
				showList : ".chosen-show-list",
				searchList : ".chosen-search-list",
				textBox :".chosen-input",
				text : ".input",
				isSearch : false,
				quickKeys : "",
				verification : "",
				action : function(){},
				createSearchList : function(){}
			};
		$.extend(option, options);
		return this.each(function(){
			var $this = $(this),
				$showList = $this.find(option.showList),
				$searchList = $this.find(option.searchList),
				$textBox = $this.find(option.textBox),
				$text = $textBox.find(option.text),
				width, styleBlock = "position:absolute; left: -2000px; top: -2000px; display:none;",
				keys = {
					back: 8,
					tab : 9,
					enter:  13,
					escape: 27,
					space : 32,
					up:     38,
					down:   40,
					array:  [8, 13, 27, 38, 40]
				},
				keyDate = [], chooseData = [];
			// 添加外部调用函数（受保护）
			$.extend(
				option, {
					searchList : $searchList,
					addShowItem : function(data){
						$textBox.before(data);
					},
					addSearchItem : function(data){
						$searchList.append(data);
					},
					usersData : function(){
						var data = [];
						$showList.find(".name").each(function(index, element){
							data.push($(this).data("model").id);
						});
						data = data.join(",");
						return data;
					},
					createChosen : function(obj, data){
						data = $.trim( obj.val() );
						// atom.log(data);
						atom.log(data.match(option.verification));
						var v = null;
						if(option.verification){
							v = data.match(option.verification);
						}
						if(option.quickKeys != "" && !v ){
							data = data.replace( option.quickKeys, "" );
						}
						if (option.verification != "") {
							// if ( option.verification.test( data ) ) {
							// 	option.addShowItem( atom.getFromTemplate( $("#J-chosen-item-template") , { fullname : data, name : $.omitMore( data, 30 ) } ) );
							// 	obj.val("");
							// } else{
							// 	$.atomStatusTips({ status : "edit", content : "Format error" });
							// 	obj.val(data).select();
							// };
							if(v && v.length>0){
								$.each(v, function(index, eml){
									// atom.log(eml);
									option.addShowItem( atom.getFromTemplate( $("#J-chosen-item-template") , { fullname : eml, name : $.omitMore( eml, 30 ) } ) );
								 	obj.val("");
								});
							}
							else{
								$.atomStatusTips({ status : "edit", content : "Format error" });
							 	obj.val(data).select();
							}
						} else{
							option.addShowItem( atom.getFromTemplate( $("#J-chosen-item-template") , { fullname : data, name : $.omitMore( data, 30 ) } ) );
							obj.val("");
						}
					}
				}
			);
			div = $("<div />", { "style": styleBlock }); 
			$('body').append(div);

			option.action(option);

			$this.off("click").on("click", function(){
				$text.focus();
			});
			$text.off("focus").on("focus", function(){
				$this.addClass("chosen-box-active");
			}).off("blur").on("blur", function(){
				$this.removeClass("chosen-box-active");
				// atom.log($(this).val());
				if(!option.isSearch && $(this).val()){
					option.createChosen($(this), $(this).val());
				}
			});

			$text.off("keyup").on("keyup", function(event){
				var keyCode = event.keyCode;
				keyDate.push((new Date()).getTime());
				var thisTime = keyDate[(keyDate.length - 1)];
				var val = "";
				// console.log(keyCode);
				// 设置输入框宽度（暂时使用）
				div.text($(this).val());
				width = div.width() + 25;
				width = width > ( $searchList.width() - 28 ) ? ( $searchList.width() - 28 ) : ( width < 25 ? 25 : width );
				$(this).width(width);
				// 需要检索列表
				if (option.isSearch) {
					if($.inArray(keyCode, keys.array) !=-1){
						switch (keyCode){
							case keys.up:
								if($searchList.is(":visible")){
									if ($searchList.children().hasClass("selected")){
										$searchList.children(".selected").prev().addClass("selected").siblings().removeClass("selected");
									}else{
										$searchList.children().eq("0").addClass("selected");
									}
								}
							break;
							case keys.down:
								if($searchList.is(":visible")){
									if ($searchList.children().hasClass("selected")){
										$searchList.children(".selected").next().addClass("selected").siblings().removeClass("selected");
									}else{
										$searchList.children().eq("0").addClass("selected");
									}
								}
							break;
							case keys.enter:
								if($searchList.is(":visible")){
									if ($searchList.children().hasClass("selected")){
										$searchList.children(".selected").click();
									}else{
										$searchList.children("li").eq(0).click();
									}
								}
							break;
							default :
							break;
						}
					}else{
						// 延时显示searchlist 减少多余查询
						setTimeout(function(){
							val = $text.val();
							var endTime = keyDate[(keyDate.length - 1)];
							if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
								option.createSearchList(option, val);
							}
						}, 300);
					}
				// 不需要检索列表
				} else{
					val = $(this).val();
					if (val != "") {
						if (keyCode == keys.enter || option.quickKeys.test(val) ) {
							option.createChosen($(this), val);
							return false;
						}
					}
				};
			});

			$text.off("keydown").on("keydown", function(event){
				var keyCode = event.keyCode;
				if (keyCode == keys.back) {
					if($(this).val() === ""){
						if($searchList.is(":visible")){ $searchList.hide(); }
						if($textBox.prevAll("li.name").length > 0){
							$textBox.prev(".name").find(".close").click();
						}
					}
				}
				if (keyCode == keys.tab) {
					option.createChosen($(this), $(this).val());
					$(this).focus();
					return false;
				}
			});

			// 删除选中元素事件 users data缓存到$searchlist
			$this.find(".close").live("click", function(){
				$(this).closest(".name").remove();
				$searchList.data( "users", option.usersData());
			});
			// 检索列表子类点击事件 users data缓存到$searchlist
			$searchList.on("click", "li",  function(){
				option.addShowItem( atom.getFromTemplate( $("#J-chosen-photo-item-template") , { id : $(this).data("model").id, avatar : $(this).find(".avatar").attr("src"), fullname : $(this).find(".title").text(), name : $.omitMore( $(this).find(".title").text(), 30 ) } ) );
				$searchList.hide();
				$text.val("");
				$searchList.data( "users", option.usersData());
			});
			
		});
	}
	
});

//$

/*******************************************************************************************************
 *	baiing View : $.cgSlider()	滑块
 *	@param []
 *	@param []	
 ********************************************************************************************************/
$.cgSlider = function( options ){
    var option = $.extend({
    	wrap : $(".wrap"),
    	width : 330,
    	scales : [0, 200, 400, 600, 800, 1000, "∞"],
    	max : 1200,
    	maxShow : {
    		max : 1000,
    		val : "不限"
    	},
    	input : {
    		has : true,
    		unit : "元"
    	},
    	init : null,
    	callback : null
    }, options);

    $.extend(option, {
		showOver : function(num){
			if (option.maxUp && num > option.maxShow.max) {
				num = option.maxShow.val;
			}
			return num;
		},
		changeScale : function( nBlock, nLine){
			option.wrap.find(".slider-block").css({ left : nBlock});
			option.wrap.find(".slider-bg").css({ width : nLine});
		}
	});

    var $wrap = option.wrap;
    var temp = '<div class="filter-slider-wrap">'+
				'<div class="filter-slider-line">'+
				'<span class="slider-bg"></span>'+
				'<span class="slider-block"></span>'+
				'</div>'+
				'<div class="filter-slider-scale">'+
				'</div>'+
				'</div>';
	var inputTemp = '<div class="price-box Js-price-box">'+
	                    '<input class="price-input Js-filter-tariff-price-input" type="text"><span class="price-unit">' + option.input.unit + '</span>'+
	                '</div>';
	if ( option.input.has ) {
		$wrap.after( inputTemp );
	}
	var $temp = $(temp);
	$wrap.append($temp);
	var $sider = $wrap.find(".filter-slider-wrap"),
	    $line = $sider.find(".filter-slider-line"),
		$lineBg = $sider.find(".slider-bg"),
		$lineBlock = $sider.find(".slider-block"),
		$scale = $sider.find(".filter-slider-scale");

	var wrapW = $line.width(),
		blockW = $lineBlock.width() / 2,
		nScale = option.max / option.width;

	var scalesLength = (option.scales.length - 1) > 0 ? (option.scales.length - 1) : 1;
	var scalesW = wrapW / scalesLength;

	// dx当前dom的left值, mx按下时鼠标的x坐标, cx每次移动的偏移值, ml移动后滑块的left值, show左侧区间的准确值
	var dx = 0, mx = 0, cx = 0, ml = 0, show = 0;  

	for( var i = 0; i < option.scales.length; i++ ){
		var $scaleTemp = $("<span>" + option.scales[i] + "</span>");

		$scale.append($scaleTemp);
		if ( typeof( option.scales[i] ) == "number" ) {
			$scaleTemp.css({ left : option.scales[i] / nScale });
		}else if ( i == (option.scales.length - 1) && option.maxShow.val ) {
			$scaleTemp.css({ left : wrapW });
		}
		$scaleTemp.css({"marginLeft" : "-" + $scaleTemp.width() / 2 + "px" });
	}

	$scale.on("click", "span", function(){

		var scaleNum = $.trim( $(this).text() ),
			nNum = 0;
		nNum = scaleNum < option.max ? scaleNum : option.max;
		option.changeScale( nNum / nScale - blockW, Math.floor(nNum / nScale) );
		nNum = option.showOver(nNum);
		if ( option.input.has ) {
			$(option.input.dom).val( nNum );
		}
		if ( typeof(option.callback) == "function" ) {
			option.callback( nNum );
		}	
	});

	// ---------------------
	// 滑块拖拽
	// ---------------------

	// 改变滑块坐标
	var changeScale = function( nBlock, nLine){
		$lineBlock.css({ left : nBlock});
		$lineBg.css({ width : nLine});
	};
	
	$lineBlock.on("mousedown", function(event){
		event.preventDefault();
		var $move = $(this);
		dx = $move.position().left;
		mx = event.pageX;
		$(document).on("mousemove", function(e){
			e.preventDefault();
			cx = mx - e.pageX;	
			ml = dx - cx;
			// ml = ml - ( ml % nScaleMove );
			show = ml + blockW;
			if (ml > ( wrapW - blockW ) ) {
				show = wrapW;
				ml = wrapW - blockW;
			}
			if (ml < ( 0 - blockW ) ) {
				show = 0;
				ml = 0 - blockW;
			}
			option.changeScale(ml, show);
			if ( option.input.has ) {
				var nNum = Math.floor(show * nScale);
				nNum = option.showOver(nNum);
				$(option.input.dom).val( nNum );
			}	
		});
		$(document).on("mouseup", function(eUp){
			var nNum = Math.floor(show * nScale);
			nNum = option.showOver(nNum);
			if ( typeof(option.callback) == "function" ) {
				option.callback( nNum );
			}
			$(document).off("mousemove").off("mouseup");
		});
	});

	$line.on("click", function(event){
		if(!$(event.target).hasClass("cg-sider-block")){
			var ml = show = 0;
			show = event.offsetX != undefined ? event.offsetX : event.originalEvent.layerX;
			ml = show - blockW;
			option.changeScale(ml, show);
			var nNum = Math.floor(show * nScale);
			if ( option.input.has ) {
				nNum = option.showOver(nNum);
				$(option.input.dom).val( nNum );
			}
			if ( typeof(option.callback) == "function" ) {
				option.callback( nNum );
			}
		}
	});

	if ( option.input.has ) {
		$(option.input.dom).val(option.input.val).cgSetNum({
			change : function(opt){
				var nNum = opt.textBox.val() > option.max ? option.max : opt.textBox.val();
				option.changeScale( nNum / nScale - blockW, Math.floor(nNum / nScale) );
				nNum = option.showOver(nNum);
				opt.textBox.val( nNum );
				if ( typeof(option.callback) == "function" ) {
					option.callback( nNum );
				}
			},
	    	out : function(opt){
	    		opt.change(opt);
	    	}
		}).blur();
		// var nNum = $(option.input.dom).val() > option.max ? option.max : $(option.input.dom).val();
		// option.changeScale( nNum / nScale - blockW, Math.floor(nNum / nScale) );
		// nNum = option.showOver(nNum);
		// $(option.input.dom).val( nNum );
	}

	// 添加特殊事件
	if ( typeof(option.init) == "function" ) {
		option.init(option);
	}
};


/*******************************************************************************************************
 *	baiing View : $.getFromTemplate()	替换模板
 *	@param [options:template($dom)]		template jquery dom
 *	@param [options:model(obj)]			{ name : value }
 ********************************************************************************************************/
$.getFromTemplate = function( template, model ){
    var templateData;
    if ( template.constructor === jQuery ) {
        templateData = template.html();
    }else if ( template.constructor === String  ){
        templateData = template;
    }
    templateData = templateData.replace(
        new RegExp( "\\#\\{([^\\}]+)\\}", "gi" ),
        function( $0, $1 ){
            if ($1 in model){
                return( model[ $1 ] );
            } else {
                return( $0 )
            }
        }
    );
    if ( template.constructor === jQuery ) {
        return( $( templateData ).data( "model", model ) );
    }else if ( template.constructor === String  ){
        return templateData;
    }
};

/*******************************************************************************************************
 *	baiing View : $.cgTag()	选项卡点击型
 *	@param [options:tagList(jquery dom)]		tag list's jquery dom
 *	@param [options:tagItem(dom)]				tag list's child dom class
 *	@param [options:conList(jquery dom)]		con list's jquery dom
 *	@param [options:conItem(dom)]				con list's child dom class
 *	@param [options:curClass(class)]			tag cur class
 *	@param [options:callback(function)]			callback function
 ********************************************************************************************************/
$.cgTag = function(options){
    var option = $.extend({
    	wrap : null,
        tagList : $(".tag-list"),
        tagItem : ".tag",
        conList: $(".con-list"),
        conItem: ".con",
        curClass : "",
        callback : null
    }, options);
    if ( !!option.wrap ) {
    	option.wrap.on("click", option.tagItem, function(){
	        var $this = $(this),
	            nIndex = $this.index(),
	            $tags = option.wrap.find(option.tagList),
	            $list = option.wrap.find(option.conList);
	        if ( !$this.hasClass(option.curClass) ) {
	            $tags.find(option.tagItem).removeClass(option.curClass);
	            $this.addClass(option.curClass);
	            $list.children().hide().eq(nIndex).show();
	            if ( typeof(option.callback) == "function" ) {
	                option.callback($this, $list.children().eq(nIndex));
	            }
	        }
	    });
    } else{
    	option.tagList.on("click", option.tagItem, function(){
	        var $this = $(this),
	            nIndex = $this.index();
	        if ( !$this.hasClass(option.curClass) ) {
	            option.tagList.find(option.tagItem).removeClass(option.curClass);
	            $this.addClass(option.curClass);
	            option.conList.children().hide().eq(nIndex).show();
	            if ( typeof(option.callback) == "function" ) {
	                option.callback($this, option.conList.children().eq(nIndex));
	            }
	        }
	    });
    }
};

/*******************************************************************************************************
 *	baiing View : $.cgTag()	选项卡点击型
 *	@param [options:tagList(jquery dom)]		tag list's jquery dom
 *	@param [options:tagItem(dom)]				tag list's child dom class
 *	@param [options:conList(jquery dom)]		con list's jquery dom
 *	@param [options:conItem(dom)]				con list's child dom class
 *	@param [options:curClass(class)]			tag cur class
 *	@param [options:callback(function)]			callback function
 ********************************************************************************************************/
$.cgSlideTag = function(options){
    var option = $.extend({
    	tabWrap : $('.module-tab-wrap'),
        tagList : $(".tag-list"),
        tagItem : ".tag",
        conList: $(".con-list"),
        conItem: ".con",
        curClass : "",
       	initCur : false,
        callback : null
    }, options);
    // init
    var width = 0;
    var cur = '.' + option.curClass;
    var	$turnToggle = option.tabWrap.find('.turn-toggle'),
    	$tabBox = option.tabWrap.find('.module-tab-box'),
    	$prev = $turnToggle.find('.prev'),
    	$next = $turnToggle.find('next');
    $tabBox.width(option.tabWrap.width() - $turnToggle.width());
    option.tagList.width(function () {
    	$.each(option.tagList.find(option.tagItem), function (index, item) {
    		width += $(item).outerWidth() + 3;
    	})
    	return width;
    });
    // init data
    $.each(option.tagList.find(option.tagItem), function (index, item) {
    	$(item).attr('data-left',$(item).position().left);
    	$(item).attr('data-width',$(item).outerWidth() + 1);
    	$(item).attr('data-sum',$(item).data('width') + $(item).position().left);
    })	
    // init function
    if (option.tagList.width() <= $tabBox.width()) {
    	$('.turn-toggle').hide();
    	option.tagList.unwrap();
    	option.tagList.width('auto');
    };
    // init cur
    if (option.initCur) {
    	option.conList.children().hide().eq(option.initCur).show();
    	if ( widthFun () ) {
    		
    		option.tagList.find(option.tagItem).eq(option.initCur).addClass(option.curClass);
    	} else {
    		option.tagList.find(option.tagItem).eq(option.initCur).addClass(option.curClass).prevAll().hide();
    		// init hide
		    for (var i = 0; i < option.tagList.find(cur).nextAll().length; i++) {
		    	if (option.tagList.find(cur).nextAll().eq(i).data('sum') - option.tagList.find(option.tagItem).filter(':hidden').last().data('sum') > $tabBox.width()) {
		    		option.tagList.find(cur).nextAll().eq(i - 1).hide().nextAll().hide();
		    	}
		    	
		    }
    	}
    } else {
    	option.tagList.find(option.tagItem).first().addClass(option.curClass);
    	// init hide
    	for (var i = 0; i < option.tagList.find(cur).nextAll().length; i++) {
	    	if (option.tagList.find(cur).nextAll().eq(i).data('sum') > $tabBox.width()) {
	    		option.tagList.find(cur).nextAll().eq(i).hide().nextAll().hide();
	    	}
	    }
    };

    // init width
    function widthFun () {
    	return $tabBox.width() > option.tagList.width();
    };
    function tabFunRight () {
		if (option.tagList.find(cur).position().left + option.tagList.find(cur).width() > $tabBox.width()) {
    		var i = option.tagList.find(cur).prevAll().filter(':visible').length,thatW = 0;
    		do {
    		    var tmpW = option.tagList.find(cur).prevAll().filter(':visible').eq(i - 1).data('sum');
    			i--;
    			// console.log(tmpW)
    		   }
    		while( ( option.tagList.find(cur).data('sum') - tmpW ) > $tabBox.width() && i >0)
    			// console.log(option.tagList.find(cur).data('sum'))
    			// console.log(( (option.tagList.find(cur).data('sum') ) - tmpW ), $tabBox.width())
    		var loopLength = option.tagList.find(cur).prevAll().filter(':visible').length - i;
    		for (var j = 0; j < loopLength; j++) {
    			option.tagList.find(cur).prevAll().filter(':visible').last().hide();
    		};
    	};

		if (option.tagList.find(cur).next().length && option.tagList.find(cur).next().data('sum') - option.tagList.find(cur).prevAll().filter(':visible').last().data('left') <  $tabBox.width()){
			option.tagList.find(cur).next().show();
		};
    }
    function tabFunLeft () {
    	if (option.tagList.find(cur).position().left + option.tagList.find(cur).width() > $tabBox.width()) {
    		var i = 0,thatW = 0;
    		do {
    		    var tmpW = option.tagList.find(cur).prevAll().filter(':visible').eq(i).width();
    		    thatW += tmpW;
    			i++;
    		   }
    		while( ( (option.tagList.find(cur).width() + option.tagList.find(cur).position().left ) - thatW )> $tabBox.width() && i < option.tagList.find(cur).prevAll().filter(':visible').length)
    		for (var j = 0; j < i; j++) {
    			option.tagList.find(cur).prevAll().filter(':visible').last().hide();
    		};
    	};
    }
    function toggleFun() {
    	if (option.tagList.find(cur).index() == 0) {
    		$turnToggle.find('.prev').addClass('not-prev');
    	} else {
    		$turnToggle.find('.prev').removeClass('not-prev');
    	};
    	if (option.tagList.find(cur).index() == option.tagList.find(option.tagItem).length - 1) {
    		$turnToggle.find('.next').addClass('not-next');
    	} else {
    		$turnToggle.find('.next').removeClass('not-next');
    	};
    }
    toggleFun();

    // action
    option.tabWrap.on('click', '.prev', function() {
    	if ( option.tagList.find(cur).index() == 0) {
    	} else {
    		if (option.tagList.find(cur).prevAll().filter(':visible').length) {

    		} else {
    			var thisW = 0,_index = 0;
    			do {
    				thisW = (option.tagList.find(cur).nextAll().eq(_index).position().left + option.tagList.find(cur).nextAll().eq(_index).width() ) - option.tagList.find(cur).position().left
					_index++
    			}	
    			while( thisW > $tabBox.width() )
    			if (option.tagList.find(cur).nextAll().eq(_index).nextAll().length) {
    				option.tagList.find(cur).nextAll().eq(_index).hide().nextAll().hide();
    			} else {
    				option.tagList.find(cur).nextAll().eq(_index).hide();
    			}
    			
    			option.tagList.find(cur).prevAll().filter(':hidden').first().show();
    		}
    		option.tagList.find(cur).removeClass(option.curClass).prev().addClass(option.curClass);
    	}
    	$(option.conItem).hide().eq(option.tagList.find(cur).index()).show();
    	toggleFun();
    })
    option.tabWrap.on('click', '.next', function() {
    	var cur = '.' + option.curClass;
    	if ((option.tagList.find(cur).index() + 1) == option.tagList.find(option.tagItem).length) {
    	} else {
    		option.tagList.find(cur).removeClass(option.curClass).next().addClass(option.curClass).show();
    	}
    	$(option.conItem).hide().eq(option.tagList.find(cur).index()).show();
    	tabFunRight ();
    	toggleFun();
    });
	option.tagList.on("click", option.tagItem, function(){
        var $this = $(this),
            nIndex = $this.index();
        if ( !$this.hasClass(option.curClass) ) {
            option.tagList.find(option.tagItem).removeClass(option.curClass);
            $this.addClass(option.curClass);
            option.conList.children().hide().eq(nIndex).show();
            
            // if (option.tagList.find(cur).prev().filter(':hidden').length) {
            // 	option.tagList.find(cur).prev().show();
            // };
            if ( typeof(option.callback) == "function" ) {
                option.callback($this, option.conList.children().eq(nIndex));
            }
        }
        toggleFun();
    });
};

/*******************************************************************************************************
*	baiing View : $.cgFloatQuickLink()	
*	@param [options:title(str)]			*title text	 
*	@param [options:template(html)]		*content html	 
*	@param [options:addClass(str)]		popup new class 
*	@param [options:isLayer(bool)]		if true, add mask layer	 
*	@param [options:hasBtn(bool)]		if false, all button hide without close button
*	@param [options:hasCancel(bool)]	if false, cancel button hide
*	@param [options:content(fun)]		content function 
*	@param [options:done(fun)]			*done function
*	@param [options:cancel(fun)]		cancel function
********************************************************************************************************/
$.cgFloatQuickLink = function(options){
	var option = $.extend({
		main : $(".main-content"),
		wrap : $(".wrap"),
		itemHook : ".hook"
	}, options);
    if ( option.wrap.find(option.itemHook).length ) {
    	var $temp = $('<div class="J-hang-wrap">'+
    		        '<div class="module-psr-wrap J-wrap">'+
    		            '<div class="J-hang Js-detaile-quick-btn">'+
    		                '<span class="Js-detaile-quick-icon" style="background-position: 16px -326px;"></span>'+
    		                '组快速定位'+
    		            '</div>'+
    		            '<ul class="J-hangList" style="display: block;"></ul>'+
    		        '</div>'+
    		    '</div>');
    	option.wrap.append($temp);
    	var $quicklist = $temp.find(".J-hangList");
		option.wrap.find(option.itemHook).each(function(){
			var $title = $(this);
			$quicklist.append( $.getFromTemplate( $("#Js-detail-quick-link-template"), { name : $title.text(), top : ($title.offset().top - 210) } ) );
		});
		if ($quicklist.find('li').length < 10) {
			$quicklist.width($quicklist.find('li').outerWidth());
			
		};
		if ((10 < $quicklist.find('li').length) && ($quicklist.find('li').length <= 20)) {
			$quicklist.width($quicklist.find('li').outerWidth()*2);
			
		};
		if ((20 < $quicklist.find('li').length) && ($quicklist.find('li').length <= 30)) {
			$quicklist.width($quicklist.find('li').outerWidth()*3);
			
		};
		if ((30 < $quicklist.find('li').length) && ($quicklist.find('li').length <= 40)) {
			$quicklist.width($quicklist.find('li').outerWidth()*4);
			
		};
		option.wrap.on("click", ".J-hangList li", function(){
			$(".Js-frame-main").animate({scrollTop : $(this).find('.Js-detail-quick-link-item').attr('data-top') },{ duration:400 , queue:false });
		});
		$(".Js-frame-main").scroll(function () {
			if ( option.main.is(":visible") ) {
				var JwrapOffsetTop = $(".Js-frame-main").scrollTop() + 48 +"px";
	       		$temp.animate({top : JwrapOffsetTop },{ duration:300 , queue:false });
			}
	    });
	    $quicklist.hide();
	    var $quickBtn = $temp.find(".Js-detaile-quick-icon");
	    $quickBtn.css('background-position','-6px -428px');
	    $temp.on("mouseenter", function(){
	    	$quickBtn.css('background-position','-6px -399px');
	    	$quicklist.fadeIn(300, function(){
            	$quicklist.one("click", function(){
                    $quickBtn.css('background-position','-6px -428px');
                    $quicklist.fadeOut();
            	});
            });
	    }).on("mouseleave", function(){
	    	$quickBtn.css('background-position','-6px -428px');
	    	$quicklist.fadeOut();
	    	$quicklist.off("click");
	    });
    }
};

/*******************************************************************************************************
 *	baiing View : $.cgConfirm()	弹出框
 *	@param [options:title(str)]			title text
 *	@param [options:message(str)]		message text
 *	@param [options:doneBtn(obj)]		fun : "btn function"
 *	@param [options:cancelBtn(obj)]		has : "is has cancel button"
 *	@param [options:cancelBtn(obj)]		fun : "btn function"
 *	@param [options:isLayer(bool)]		if true, add mask layer
 ********************************************************************************************************/
$.cgConfirm = function( options ) {
    var option = $.extend({
            title: "提示",
            message: "",
            doneBtn: {
                fun: function( events ){
                    // alert("OK");
                }
            },
            cancelBtn: {
                has : true,
                fun : function( events ) {
                    // alert("Cancel");
                }
            },
            isLayer : true
        }, options),
        $popup = $('<div class="module-popup fn-clear Js-popup-wrap">'+
            // '<div class="popup-wrap fn-clear Js-popup-wrap">'+
            '<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
            '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
            '<div class="popup-con Js-popup-con">'+
            '<p class="confirm-msg Js-popup-msg">' + option.message + '</p>'+
            '</div>'+
            '<div class="btn-wrap">'+
   //          '<input type="button" class="popup-btn input-btn Js-popup-done" value="确定">'+
			// '<input type="button" class="popup-btn input-btn Js-popup-cancel" value="取消">'+
			'<a class="popup-btn Js-popup-done" href="javascript:;;"><span class="popup-btn-text">确认</span></a>'+
            '<a class="popup-btn Js-popup-cancel" href="javascript:;;"><span class="popup-btn-text">取消</span></a>'+
            '</div>'+
            // '</div>'+
            '</div>');
    if ( option.isLayer ) {
        var $layer = $("<div class='module-popup-layer'></div>");
        $("body").append($layer);
    }
    $("body").append( $popup );
    // console.log(option);
    var	$confirm = $popup,
        $confirmTitle = $confirm.find('.Js-popup-title').hide(),
        $confirmMessage = $confirm.find('.Js-popup-msg'),
        $confirmDone = $confirm.find('.Js-popup-done'),
        $confirmCancel = $confirm.find('.Js-popup-cancel').hide(),
        $confirmClose = $confirm.find('.Js-popup-close'),
        openConfirm = function() {
            // bind title
            if(option.title){
                $confirmTitle.show();
            }
            // bind message
            if(option.message){
                $confirmMessage.text( option.message ).show();
            }
            // bind done button
            if(option.doneBtn.fun && $.isFunction(option.doneBtn.fun)){
                $confirmDone.one("click", function( event ) {
                    option.doneBtn.fun( event );
                    closeConfirm();
                });
            }
            // bind close button
            $confirmClose.one("click", function(){
                closeConfirm();
            });
            // bind cancel button
            if ( option.cancelBtn.has ) {
                $confirmCancel.show();
                if(option.cancelBtn.fun && $.isFunction(option.cancelBtn.fun)){
                    $confirmCancel.one("click", function( event ) {
                        option.cancelBtn.fun( event );
                        closeConfirm();
                    });
                }
                // reset bind close button
                $confirmClose.off("click").one("click", function(){
                    $confirmCancel.click();
                });
            }
            // bind wrap position
            positionCenter();
            $(window).resize(function(){
                positionCenter();
            });
            $popup.show();
        },
        positionCenter = function(){
            var objWidht = $popup.width(),
                objHeight = $popup.height();
            $popup.css( { "margin-left" : "-" + objWidht / 2 + "px" } );
        },
        closeConfirm = function() {
            $popup.remove();
            if ( option.isLayer ) {
                $layer.remove();
            }
        };
    // console.log($confirm.length);
    openConfirm();
};

/*******************************************************************************************************
 *	baiing View : $.cgResultTips()	结果提示框， 引用$.cgPopup
 *	@param [options:title(str)]				title text	default title is "操作成功|操作失败"
 *	@param [options:type(str)]				*[ message | error ]
 *	@param [options:message(str|array)]		*[ message : str | error : array(str, str) ]
 *	@param [options:time(number)]			if type is message the popup box fadeout time
 ********************************************************************************************************/
$.cgResultTips = function(options){
    var option = $.extend({
        title : "",
        type : "",
        message : [],
        time : 3000
    }, options);
    var str = "";
    switch(option.type){
        case "message" :
            if ( typeof(option.message) == "string" ) {
                str = '<p class="confirm-msg Js-popup-msg">' + option.message + '</p>';
            }
            option.title = option.title ? option.title : "操作成功";
            option.con = function(opt){
                setTimeout(function(){
                    opt.oPopup.fadeOut("normal", function(){
                        opt.close();
                    });
                }, option.time);
            };
            break;
        case "error" :
            if ( option.message.constructor === Array && option.message.length > 0 ) {
                for( var i = 0; i < option.message.length; i++ ){
                    str += '<p class="confirm-error-msg Js-popup-msg">' + option.message[i] + '</p>';
                }
            }
            option.title = option.title ? option.title : "操作失败";
            option.con = function(opt){

            };
            break;
        default :
            break;
    };
    $.cgPopup({
        title : option.title,
        template : str,
        isLayer : true,
        hasBtn : true,
        hasCancel : false,
        content : function(opt){
            option.con(opt);
        },
        done : function(opt){
            opt.close();
        }
    });
};

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
				    	'<a class="btn btn-white Js-popup-done" href="javascript:;;"><span class="btn-text">确认</span></a>'+
            			'<a class="btn btn-white Js-popup-cancel" href="javascript:;;"><span class="btn-text">取消</span></a>'+
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

$.omitMore = function( string, count ) {
	var strArr = string.split(""),
		count = (count)? count: 100000,
		stringLength = 0,
		stringArray = [],
		beforeString = '',
		afterString = '',
		hfLength = Math.floor(count/2);
	
	for (var i = 0; i < strArr.length; i++ ) {
		if( /[\u4e00-\u9fa5]/.test( strArr[i] ) ){
			stringLength += 1.6;
			stringArray.push({text: strArr[i], sub: stringLength});
		}
		else{
			stringLength += 1;
			stringArray.push({text: strArr[i], sub: stringLength});
		}
	}
	if( stringLength > count + 3 ){
		for (var i = 0; i < stringArray.length; i++ ) {
			if(stringArray[i].sub <= hfLength){
				beforeString += stringArray[i].text;
			}
			
			if( stringArray[i].sub >= ( stringLength - hfLength ) && stringArray[i].sub <= stringLength ){
				afterString += stringArray[i].text;
			}
		}
		return beforeString + '...' + afterString;
	}
	return string;
};

$.omitRows = function( string, count ) {
	var strArr = string.split(""),
		count = (count)? count: 100000,
		stringLength = 0,
		stringArray = [],
		beforeString = '',
		hfLength = Math.floor(count/2);
	
	for (var i = 0; i < strArr.length; i++ ) {
		if( /[\u4e00-\u9fa5]/.test( strArr[i] ) ){
			stringLength += 1.6;
			stringArray.push({text: strArr[i], sub: stringLength});
		}
		else{
			stringLength += 1;
			stringArray.push({text: strArr[i], sub: stringLength});
		}
	}
	if( stringLength > count + 3 ){
		for (var i = 0; i < stringArray.length; i++ ) {
			if(stringArray[i].sub <= count){
				beforeString += stringArray[i].text;
			}
		}
		return beforeString + '...';
	}
	return string;
};


/*******************************************************************************************************
* autoAlign : 根据窗口大小自动剧中对齐
********************************************************************************************************/
$.autoAlign = function(obj){
    function fn(){
        var bodyWidth = $('body').width()-35;
        var objWidht = $(obj).children().outerWidth(true);
        var maxNum = parseInt( bodyWidth/objWidht );
        var thisWidth = maxNum*objWidht;
        $(obj).width(thisWidth).css( { 'margin-left':'auto','margin-right':'auto' } );
    };

    fn();

    $(window).resize(function(){
        fn()
    });
};

/*******************************************************************************************************
* scrollTop : 滚动到顶边
********************************************************************************************************/
$.scrollTop = function(obj,fn){
    $(obj).scroll(function() {
    	//document.title = $(obj).scrollTop()
        if ( $(obj).scrollTop()==0 ) {
            fn();
        };
    });
};

/*******************************************************************************************************
* scrollBottom : 滚动到底边
********************************************************************************************************/
$.scrollBottom = function(obj1,obj2,fn,setAttr){
    $(obj1).scroll(function() {
    	//document.title = $(obj1).scrollTop()+$(obj1).height()+'====='+$(obj2).innerHeight()
    	$(obj2).each(function(){
    		if($(this).css('display') != 'none'){
	    		if(setAttr){
		    		$(obj1).attr('scrolltop',$(obj1).scrollTop());
		    	}
		        if ( $(obj1).scrollTop()+$(obj1).height()==$(this).outerHeight() ) {
		            fn();
		        };
	        }
    	});    	
    });
};

/*******************************************************************************************************
* loader : loading
********************************************************************************************************/
$.loader = function( bool ){
	var options = {
			width: 42,
			height: 42,
			className: 'loader'
		},
		_strImg = '<img src="' + base + '/images/lib/i.gif" alt="loading" />';
		i = 0, $img = $(_strImg),
		run = function(){
			//atom.log( 0 - i * options.height );
			if( i > 11 ){
				i = 0;
			}
			$img.css( 'background-position', '0 ' + ( 0 - i * options.height ) + 'px' );
			i++;
			setTimeout( run, 50 );
		};

	if(!bool){
		options = {
			width: 35,
			height: 35,
			className: 'loader-black'
		};
	}

	$img.css({ width: options.width, height: options.height }).addClass(options.className);

	run();

	return $img;
};
/*******************************************************************************************************
* loader : layerLoader
********************************************************************************************************/
$.layerLoader = function(){
	var options = {
			height: $(window).height() - $(".frame-top").height() + "px"
		},
		$loading = $('<div class="layer-loading"></div>');
	$loading.css({ height: options.height, opacity : 0.3, top : $(".frame-top").height() + "px" });
	return $loading;
};

/*******************************************************************************************************
* cgImgShow : 图片左右切换
********************************************************************************************************/
$.cgImgShow = function(options){
	var option = $.extend({
		wrap : $(".wrap"),
		listWrap : ".listWrap",
		list : ".list",
		item : ".item",
		position : 90,
		leftBtn : ".leftBtn",
		rightBtn : ".rightBtn",
		init : null
	}, options);

	// protected 
	$.extend(option, {
		turnLeft : function(){
			if ( !$list.is(":animated") ) {
				$list.animate({ left : "-=" + option.position  }, 300, function(){
					$list.children().first().appendTo($list);
					$list.css({
						"left" : "+=" + option.position
					});
				});
			}
		},
		turnRight : function(){
			if ( !$list.is(":animated") ) {
				$list.animate({ left : "+=" + option.position  }, 300, function(){
					$list.children().last().prependTo($list);
					$list.css({
						"left" : "-=" + option.position
					});
				});
			}
		}
	});

	var $wrap = option.wrap,
		$listWrap = $wrap.find(option.listWrap),
		$list = $wrap.find(option.list),
		$item = $list.find(option.item);
	$item.filter(":last").prependTo($list);
	$list.css({
		"left" : "-=" + option.position
	});

	$wrap.on("click", option.leftBtn, function(){
		option.turnRight();
	});

	$wrap.on("click", option.rightBtn, function(){
		option.turnLeft();
	});
	
	// 添加特殊事件
	if ( typeof(option.init) == "function" ) {
		option.init(option);
	}
};


/*******************************************************************************************************
* cgAutoComplete : 自动完成
********************************************************************************************************/
	
$.cgAutoComplete = function(options){
	var option = {
			frameBox : $(".Js-auto-frame"),
			autoList : ".Js-auto-list",
			autoItem : ".Js-auto-item",
			autoText : ".Js-auto-text",
			autoBtn : $(".Js-auto-btn"),
			hasBtn : true,
			hoverClass : "selected",
			titleClass : "",
			placeholder : "",
			isSearch : true,
			init : function(option){},
			action : function(option, val){},
			createSearchList : function(option, val){}
		};
	$.extend(option, options);
	// 添加外部调用函数（受保护）
	$.extend(option, {
		_returnText : function(value){
			option.text.val( value );
		},
		addItem : function($temp, data){
			if ( data.constructor === Array && data.length ) {
				$.each(data, function(index, item){
					option.list.append( $.getFromTemplate( $temp, item ) );
				});
			}else{
				option.list.append( $.getFromTemplate( $temp, data ) );
			}
		},
		showList : function(){
			option.list.slideDown("fast", "linear", function(){
				$(document).one("click", function(){
					option.list.hide();
				});
			});
			
		},
		closeList : function(){
			option.list.hide();
		}
	});
	var keys = {
			back: 8,
			enter:  13,
			escape: 27,
			up:     38,
			down:   40,
			array:  [13, 27, 38, 40]
		},keyDate = [], chooseData = [];

	var $list = option.frameBox.find(option.autoList),
		$text = option.frameBox.find(option.autoText);
	$.extend(option, { list : $list, text : $text });
	$list.on("mouseenter", option.autoItem, function(){
		$(this).addClass(option.hoverClass);
	}).on("mouseleave", option.autoItem,function(){
		$(this).removeClass(option.hoverClass);
	});

	$list.on("click", option.autoItem, function(){
	    $list.hide();
	    if ( typeof( option.action ) == "function" ) {
	    	option.action(option, $.trim( $(this).children().attr("title") ), $(this) );
	    }
	    option._returnText( $(this).children().attr("title") );
	});

	$text.on("keyup", function(event){
		var keyCode = event.keyCode;
		keyDate.push((new Date()).getTime());
		var thisTime = keyDate[(keyDate.length - 1)];
		var val = "";
		// 需要检索列表
		if (option.isSearch) {
			if($.inArray(keyCode, keys.array) !=-1){
				if( $list.is(":visible") ){
					var $item = $list.children(option.autoItem),
						$cur = $item.filter("." + option.hoverClass);
					switch (keyCode){
						case keys.up:
							if ( $cur.length ){
								$item.removeClass(option.hoverClass);
								$cur.prev().addClass(option.hoverClass);
							}else{
								$item.last().addClass(option.hoverClass);
							}
						break;
						case keys.down:
							if ( $cur.length ){
								$item.removeClass(option.hoverClass);
								$cur.next().addClass(option.hoverClass);
							}else{
								$item.first().addClass(option.hoverClass);
							}
						break;
						case keys.enter:
							$list.hide();
							if ( typeof( option.action ) == "function" ) {
								if ( $cur.length ) {
									$cur.click();
								} else{
									option.action(option, $.trim( $text.val() ), $cur );
								}
								
							}
						break;
						default :
						break;
					}
				}else{
					if( keyCode == keys.enter ){
						if ( typeof( option.action ) == "function" ) {
							option.action(option, $.trim( $text.val() ) );
						}
					}
				}
			}else{
				// 延时显示searchlist 减少多余查询
				setTimeout(function(){
					val = $.trim( $text.val() );
					if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
						option.createSearchList(option, val);
					}else if ( val == "" ){
						option.list.hide();
					}
				}, 300);
			}
		// 不需要检索列表
		} else{
			val = $(this).val();
			if (val != "") {
				if (keyCode == keys.enter) {
						// console.log("enter");
					// option.createChosen($(this), val);
					return false;
				}
			}
		};
	});

	$text.on("keydown", function(event){
		var keyCode = event.keyCode;
		if (keyCode == keys.back) {
			if( $.trim( $(this).val() ) === ""){
				if($list.is(":visible")){ $list.hide(); }
			}
		}
	});

	$text.on("focus", function(event){
		var val = $.trim( $(this).val() );
		if( val != "" && $list.children().length && $list.is(":hidden") ){
			option.showList();
			// option.createSearchList(option, val);
		}
	});

	if ( option.hasBtn ) {
		option.autoBtn.on("click", function(){
			$list.hide();
			if ( typeof( option.action ) == "function" ) {
				option.action(option, $.trim( $text.val() ) );
			}
		});
	}
	// init
	if ( typeof( option.init ) == "function" ) {
		option.init(option);
	}
}

/*******************************************************************************************************
*	cgUI View : $.cgSelectScroll()	移动滑块 * 为必填
*	@param [options]	 wrap(*) : 输出的标签dom $(".dom")
*	@param [options]	 addClass : 可附加添加样式
*	@param [options]	 scales(*) : 标尺的数组 new Array() *只有最后一位可以为字符串，其他值必须为数字
*	@param [options]	 max(*) : 标尺最大值 必须为数字
*	@param [options]	 maxUp(*) : 如果标尺的数组最后一位为字符串 此值为true
*	@param [options]	 input(*) : input.has 为true时有输出input , input.dom 必填 ".input"
*	@param [options]	 callback : 回调函数 参数为操作后标尺的值
********************************************************************************************************/
$.cgSelectScroll = function(options){
	var option = {
			wrap : $(".wrap"),
			addClass : "",
			scales : new Array(0, 200, 400, 600, 800, 1000, "∞"),
			max : 1200,
			maxUp : true,
			maxShow : {
				max : 1000,
				val : "不限"
			},
			input : {
				has : true,
				dom : ".input"
			},
			init : function(){},
			callback : function(){}
		};
	$.extend(option, options);
	$.extend(option, {
		showOver : function(num){
			if (option.maxUp && num > option.maxShow.max) {
				num = option.maxShow.val;
			}
			return num;
		},
		changeScale : function( nBlock, nLine){
			option.wrap.find(".cg-sider-block").css({ left : nBlock});
			option.wrap.find(".cg-sider-bg").css({ width : nLine});
		}
	});
	var $wrap = option.wrap;
	var temp = '<div class="cg-sider">'+
				'<div class="cg-sider-line">'+
				'<span class="cg-sider-bg"></span>'+
				'<span class="cg-sider-block"></span>'+
				'</div>'+
				'<div class="cg-sider-scale">'+
				'</div>'+
				'</div>';
	var $temp = $(temp);
	$wrap.append($temp);
	var $sider = $wrap.find(".cg-sider"),
	    $line = $sider.find(".cg-sider-line"),
		$lineBg = $sider.find(".cg-sider-bg"),
		$lineBlock = $sider.find(".cg-sider-block"),
		$scale = $sider.find(".cg-sider-scale");
	if (option.addClass) {
		$sider.addClass(option.addClass);
	}

	var wrapW = $line.width(),
		blockW = $lineBlock.width() / 2,
		nScale = option.max / wrapW;

	var scalesLength = (option.scales.length - 1) > 0 ? (option.scales.length - 1) : 1;
	var scalesW = wrapW / scalesLength;

	// dx当前dom的left值, mx按下时鼠标的x坐标, cx每次移动的偏移值, ml移动后滑块的left值, show左侧区间的准确值
	var dx = mx = cx = ml = show = 0;  

	for( var i = 0; i < option.scales.length; i++ ){
		var $scaleTemp = $("<span>" + option.scales[i] + "</span>");

		$scale.append($scaleTemp);
		if ( typeof( option.scales[i] ) == "number" ) {
			$scaleTemp.css({ left : option.scales[i] / nScale });
		}else if ( i == (option.scales.length - 1) && option.maxUp ) {
			$scaleTemp.css({ left : wrapW });
		}
		$scaleTemp.css({"marginLeft" : "-" + $scaleTemp.width() / 2 + "px" });
	}

	$scale.on("click", "span", function(){

		var scaleNum = $.trim( $(this).text() ),
			nNum = 0;
		nNum = scaleNum < option.max ? scaleNum : option.max;
		option.changeScale( nNum / nScale - blockW, Math.floor(nNum / nScale) );
		nNum = option.showOver(nNum);
		if ( option.input.has ) {
			$(option.input.dom).val( nNum );
		}
		if ( typeof(option.callback) == "function" ) {
			option.callback( nNum );
		}	
	});

	

	// ---------------------
	// 滑块拖拽
	// ---------------------

	// 改变滑块坐标
	var changeScale = function( nBlock, nLine){
		$lineBlock.css({ left : nBlock});
		$lineBg.css({ width : nLine});
	};
	
	$lineBlock.on("mousedown", function(event){
		event.preventDefault();
		var $move = $(this);
		dx = $move.position().left;
		mx = event.pageX;
		$(document).on("mousemove", function(e){
			e.preventDefault();
			cx = mx - e.pageX;	
			ml = dx - cx;
			// ml = ml - ( ml % nScaleMove );
			show = ml + blockW;
			if (ml > ( wrapW - blockW ) ) {
				show = wrapW;
				ml = wrapW - blockW;
			}
			if (ml < ( 0 - blockW ) ) {
				show = 0;
				ml = 0 - blockW;
			}
			option.changeScale(ml, show);
			if ( option.input.has ) {
				var nNum = Math.floor(show * nScale);
				nNum = option.showOver(nNum);
				$(option.input.dom).val( nNum );
			}	
		});
		$(document).on("mouseup", function(eUp){
			var nNum = Math.floor(show * nScale);
			nNum = option.showOver(nNum);
			if ( typeof(option.callback) == "function" ) {
				option.callback( nNum );
			}
			$(document).off("mousemove").off("mouseup");
		});
	});

	$line.on("click", function(event){
		if(!$(event.target).hasClass("cg-sider-block")){
			var ml = show = 0;
			show = event.offsetX != undefined ? event.offsetX : event.originalEvent.layerX;
			ml = show - blockW;
			option.changeScale(ml, show);
			var nNum = Math.floor(show * nScale);
			if ( option.input.has ) {
				nNum = option.showOver(nNum);
				$(option.input.dom).val( nNum );
			}
			option.callback( nNum );
		}
	});

	if ( option.input.has ) {
		$(option.input.dom).val(option.input.val).cgSetNum({
			change : function(opt){
				var nNum = opt.textBox.val() > option.max ? option.max : opt.textBox.val();
				option.changeScale( nNum / nScale - blockW, Math.floor(nNum / nScale) );
				nNum = option.showOver(nNum);
				opt.textBox.val( nNum );
				if ( typeof(option.callback) == "function" ) {
					option.callback( nNum );
				}
			},
	    	out : function(opt){
	    		opt.change(opt);
	    	}
		});
		// var nNum = $(option.input.dom).val() > option.max ? option.max : $(option.input.dom).val();
		// option.changeScale( nNum / nScale - blockW, Math.floor(nNum / nScale) );
		// nNum = option.showOver(nNum);
		// $(option.input.dom).val( nNum );
	}

	// 添加特殊事件
	if ( typeof(option.init) == "function" ) {
		option.init(option);
	}
}

/*******************************************************************************************************
*	cgUI View : $.cgFilterSelect()	筛选整合模块 * 为必填
*	@param [options]	 arrScales(*) : 输出的标签dom ".dom"
*	@param [options]	 arrRadios : 可附加添加样式
*	@param [options]	 scales(*) : 标尺的数组 new Array() *只有最后一位可以为字符串，其他值必须为数字
*	@param [options]	 max(*) : 标尺最大值 必须为数字
*	@param [options]	 maxUp(*) : 如果标尺的数组最后一位为字符串 此值为true
*	@param [options]	 input(*) : input.has 为true时有输出input , input.dom 必填 ".input"
*	@param [options]	 callback : 回调函数 参数为操作后标尺的值
********************************************************************************************************/
$.cgFilterSelectController = function(options){
	var option = {
			arrScales : [
				{ 
					dom : $(".wrap"),
					scales : new Array(0, 200, 400, 600, 800, 1000),
					max : 1000,
					maxUp : false,
					input : { has : true, dom : ".input" }
				},
				{ 
					dom : $(".wrapPhone"),
					scales : new Array(0, 200, 400, 600, 800, 1000, "∞"),
					max : 1200,
					maxUp : true,
					input : { has : true, dom : ".input2" }
				}
			],
			arrRadios : [
				{ dom : $("#packageFilterWrapper7 .J-filter-radio"), resultType : "daikuan" },
				{ dom : $("#packageFilterWrapper4 .J-filter-radio"), resultType : "liuliang" },
				{ dom : $("#packageFilterWrapper5 .J-filter-radio"), resultType : "duanxin" },
				{ dom : $("#packageFilterWrapper6 .J-filter-radio"), resultType : "wifi" }
			],
			addRadioClass : "",
			arrTitleWrap : $(".J-filter-checkbox"),
			resultWrap : $(".resultWrap"),
			dropWrap : $(".dropWrap"),
			resultData : {
				tel : $("#packageFilter11Value"),
				net : $("#packageFilter12Value"),
				phone : $("#packageFilter13Value"),
				itv : $("#packageFilter14Value"),
				packPay : $("#packageFilter2Value"),
				runtime : $("#packageFilter3Value"),
				flow : $("#packageFilter4Value"),
				message : $("#packageFilter5Value"),
				wifi : $("#packageFilter6Value"),
				radioNet : $("#packageFilter7Value")
			},
			init : function(){},
			callback : function(){}
		};
	$.extend(option, options);
	$.extend(option, {
		addResult : function(strData, type, prepend){
			var temp = '<li class="selected J-filter-type-' + type + '" data-type="' + type + '"><a href="javascript:void(0)">' + strData.str + '</a></li>';
			var tempFix = '<li class="J-filter-type-' + type + '" data-type="' + type + '"><a href="javascript:void(0)">' + strData.str + '</a></li>';
			// var temp = '<li class="J-filter-type-' + type + '" data-type="' + type + '"><a href="javascript:void(0);">' + str + '</a></li>';
			// var tempFix = '<li class="J-filter-type-' + type + '" data-type="' + type + '"><a class="fix" href="javascript:void(0);">' + str + '</a></li>';
			option.resultWrap.find(".J-filter-type-" + type).remove();
			if (prepend) {
				option.resultWrap.prepend(tempFix);
			}else{
				option.resultWrap.append(temp);
			}
			// console.log(type,strData.val);
			option.resultData[type].val(strData.val);
			if ( typeof(option.callback) == "function" ) {
				option.callback();
			}
		},
		initResult : function(str, type, prepend){
			var temp = '<li class="selected J-filter-type-' + type + '" data-type="' + type + '"><a href="javascript:void(0)">' + str + '</a></li>';
			var tempFix = '<li class="J-filter-type-' + type + '" data-type="' + type + '"><a href="javascript:void(0)">' + str + '</a></li>';
			// var temp = '<li class="J-filter-type-' + type + '" data-type="' + type + '"><a href="javascript:void(0);">' + str + '</a></li>';
			// var tempFix = '<li class="J-filter-type-' + type + '" data-type="' + type + '"><a class="fix" href="javascript:void(0);">' + str + '</a></li>';
			option.resultWrap.find(".J-filter-type-" + type).remove();
			if (prepend) {
				option.resultWrap.prepend(tempFix);
			}else{
				option.resultWrap.append(temp);
			}
			// console.log(option.resultData[type]);
			option.resultData[type].val(str);
		},
		removeResult : function(type, str){
			option.resultData[type].val( str? str : "");
			if ( typeof(option.callback) == "function" ) {
				option.callback();
			}
		},
		toggleSelector : function(isDown, btn){
			if (isDown) {
				btn.addClass("i-arrow-f");
			}else{
				btn.removeClass("i-arrow-f");
			}
		}
	});

	if ( option.arrScales.constructor === Array && option.arrScales.length > 0 ) {
		$.each( option.arrScales, function( index, arr ){
			$.cgSelectScroll({
				wrap : arr.dom,
				scales : arr.scales,
				max : arr.max,
				maxUp : arr.maxUp,
				maxShow : arr.maxShow,
				input : arr.input,
				init : function(opt){
					switch(arr.resultType){
						case "runtime" :
							var $input = $(arr.input.dom);
							$(".Js-pack-filter-runtime-item input").on("change", function(){
								if ($(this).is(":checked") && $input.val() != 0) {
									option.addResult($input.val() + $input.next().text() + "(" + $(this).val() + ")", arr.resultType);
								}else{
									option.resultWrap.find(".J-filter-type-" + arr.resultType).remove();
								}
							});
						break;
						default :
						break;
					}
				},
				callback : function(num){
					// console.log(num);
					switch(arr.resultType){
						case "packPay" :
							if (num == 0 || num == "不限") {
								num = "不限";
								option.addResult(num, arr.resultType, true);
							}else{
								option.addResult(num + $(arr.input.dom).next().text(), arr.resultType, true);
							}
							
						break;
						case "runtime" :
							var phoneType = $(".Js-pack-filter-runtime-item").find("input:checked").val();
							if (num != 0) {
								option.addResult(num + $(arr.input.dom).next().text() + "(" + phoneType + ")", arr.resultType);
							}else{
								option.resultWrap.find(".J-filter-type-" + arr.resultType).remove();
								option.removeResult(arr.resultType);
							}
						break;
					}
				}
			});	
		});
	}

	if ( option.arrRadios.constructor === Array && option.arrRadios.length > 0 ) {
		$.each( option.arrRadios, function( index, arr ){
			arr.dom.cgChangeRadio({
				addClass : option.addRadioClass,
				add : function(strData){
					arr.dom.addClass("J-filter-wrap-type-" + arr.resultType);
					// console.log(arr.resultType);
					if ( arr.resultType == "runtime" ) {
						strData.str = $(".Js-pack-filter-runtime-item").find("input:radio:checked").val() + ":" + strData.str;
						strData.val = $(".Js-pack-filter-runtime-item").find("input:radio:checked").val() + ":" + strData.val;
					}
					option.addResult(strData, arr.resultType);
					// option.callback(strData);
				},
				remove : function(strData){
					option.resultWrap.find(".J-filter-type-" + arr.resultType).remove();
					option.removeResult(arr.resultType);
					// option.callback(str);
				}
			});
		});
	}

	// * pack filter only
	if( $(".Js-pack-filter-change-phone").length ){
		$(".Js-pack-filter-change-phone").addClass("fn-hide");
	}
	if( $(".Js-pack-filter-change-phone-more").length ){
		$(".Js-pack-filter-change-phone-more").on("click", ".Js-pack-filter-phone-more", function(){
			var $packPhoneMore = $(this);
			if ($(".Js-pack-filter-change-phone-wrap").is(":visible")) {
				$(".Js-pack-filter-change-phone-wrap").slideUp("300", function(){
					$packPhoneMore.text("更多条件");
				});
			}else{
				$(".Js-pack-filter-change-phone-wrap").slideDown("300", function(){
					$packPhoneMore.text("隐藏条件");
				});
			}
		});
	}
	if ($(".Js-pack-filter-drop-btn").length) {
		var $packDropBtn = $(".Js-pack-filter-drop-btn").children();
		$(".Js-pack-filter-drop-btn").on("click", function(){
			if (!$packDropBtn.hasClass("i-arrow-f")) {
				if ($(".Js-pack-filter-title-checkbox").find("[data-type=net]").prop("checked") || $(".Js-pack-filter-title-checkbox").find("[data-type=phone]").prop("checked")) {
					$(".Js-pack-filter-change-phone").slideUp(300);
					$(".Js-pack-filter-change-net").slideUp(300);
					$(".Js-pack-filter-change-phone-more").slideUp(300);
					$(".Js-pack-filter-change-phone-wrap").slideUp(300);
					option.toggleSelector(true, $packDropBtn);
				}
			}else{
				if ($(".Js-pack-filter-title-checkbox").find("[data-type=net]").prop("checked") || $(".Js-pack-filter-title-checkbox").find("[data-type=phone]").prop("checked")) {
					if ( $(".Js-pack-filter-title-checkbox").find("[data-type=net]").prop("checked") ) {
						$(".Js-pack-filter-change-net").slideDown(300);
					}
					if ( $(".Js-pack-filter-title-checkbox").find("[data-type=phone]").prop("checked") ) {
						$(".Js-pack-filter-change-phone").slideDown(300);
						$(".Js-pack-filter-change-phone-more").slideDown(300);
						if($(".Js-pack-filter-phone-more").text() == "隐藏条件"){
							$(".Js-pack-filter-change-phone-wrap").slideDown(300);
						}
					}
				}
				option.toggleSelector(false, $packDropBtn);
			}
		});
	}

	// bind drop btn
	if( option.dropWrap.length ){
		$(".Js-drop-btn-wrap").on("click", ".Js-drop-btn", function(){
			var $comDropBtn = $(this).children();
			if( option.dropWrap.is(":hidden") ){
				option.dropWrap.slideDown(300);
				option.toggleSelector(false, $comDropBtn);
			}else{
				option.dropWrap.slideUp(300);
				option.toggleSelector(true, $comDropBtn);
			}
		});
	}

	var changeTitle = function(type, isShow){
		if (isShow) {
			switch(type){
				case "tel":
				break;
				case "net":
					$(".Js-pack-filter-change-net").slideDown(300);
					option.toggleSelector(false, $packDropBtn);
				break;
				case "phone":
					$(".Js-pack-filter-change-phone").slideDown(300, function(){
						$(".Js-pack-filter-change-phone-more").show();
					});
					option.toggleSelector(false, $packDropBtn);
				break;
				case "itv":
				break;
				default:
				break;
			}
		}else{
			switch(type){
				case "tel":
				break;
				case "net":
					$(".Js-pack-filter-change-net").slideUp(300);
					if ($(".Js-pack-filter-title-checkbox").find("[data-type=phone]").prop("checked")) {
						if($(".Js-pack-filter-change-phone").is("visible")){
							option.toggleSelector(false, $packDropBtn);
						}
					}else{
						option.toggleSelector(false, $packDropBtn);
					}
				break;
				case "phone":
					$(".Js-pack-filter-change-phone-more").hide();
					$(".Js-pack-filter-phone-more").text("更多条件");
					$(".Js-pack-filter-change-phone").slideUp(300);
					if($(".Js-pack-filter-change-phone-wrap").is(":visible")){
						$(".Js-pack-filter-change-phone-wrap").slideUp("300");
					}
					option.resultWrap.find(".J-filter-type-runtime").click();
					option.resultWrap.find(".J-filter-type-flow").click();
					option.resultWrap.find(".J-filter-type-message").click();
					option.resultWrap.find(".J-filter-type-wifi").click();
					if ($(".Js-pack-filter-title-checkbox").find("[data-type=net]").prop("checked")) {
						if($(".Js-pack-filter-change-net").is("visible")){
							option.toggleSelector(false, $packDropBtn);
						}
					}else{
						option.toggleSelector(false, $packDropBtn);
					}
				break;
				case "itv":
				break;
				default:
				break;
			}
		}
	}

	option.arrTitleWrap.on("change", "input", function(){
		var type = $(this).attr("data-type");
		if ($(this).is(":checked")) {
			option.addResult({ str : $(this).val(), val : $(this).attr("data-val") }, type);
			changeTitle(type, true);
		}else{
			option.resultWrap.find(".J-filter-type-" + type).remove();
			option.removeResult(type);
			changeTitle(type, false);
		}
	});

	option.resultWrap.on("click", "li", function(){
		var type = $(this).attr("data-type");
		if (type != "packPay") {
			option.removeResult(type);
		}
		switch(type){
			case "packPay" :
				// $(".pricing-input").val(0).blur();
			break;
			case "runtime" :
				// $(".Js-filter-runtime-price-input").val(0).blur();
				$(".J-filter-wrap-type-runtime").children().removeClass(option.addRadioClass);
				$(this).remove();
			break;
			case "tel" :
				// $(this).remove();
				option.arrTitleWrap.find("input").filter( "[data-type = 'tel']" ).prop("checked", false).change();
			break;
			case "net" :
				option.arrTitleWrap.find("input").filter( "[data-type = 'net']" ).prop("checked", false).change();
			break;
			case "phone" :
				option.arrTitleWrap.find("input").filter( "[data-type = 'phone']" ).prop("checked", false).change();
			break;
			case "itv" :
				option.arrTitleWrap.find("input").filter( "[data-type = 'itv']" ).prop("checked", false).change();
			break;
			default : 
				$(".J-filter-wrap-type-" + type).children().removeClass(option.addRadioClass);
				$(this).remove();
			break;
		}	
	});

	// 初始事件
	if ( typeof(option.init) == "function" ) {
		option.init(option);
	}

}

/*******************************************************************************************************
*	cgUI View : $.cgProdContrast()	对比模块 * 为必填
*	@param [options]	 callback : 回调函数 参数为操作后标尺的值
********************************************************************************************************/
$.cgProdContrast = function(options){
	var option = {
			mainWrap : $("#listConstainer"),
			checkGroupName : "contrast-mobile",
			checkVal : {
				id : "data-id",
				name : "data-name",
				price : "data-price",
				image : "data-image"
			},
			contrastWrap : $(".J-contrast-wrap"),
			contrastList : $(".J-contrast-list"),
			contrastItem : ".J-contrast-item",
			contrastTemp : $("#J-contrast-template"),
			contrastClose : ".J-contrast-close",
			contrastRemoveBtn : ".J-remove-item",
			contrastClearBtn : ".J-contrast-clear",
			contrastBtn : ".J-btn",
			contrastBtnClass : "dui-bi-btn",
			contrastTips : $(".J-contrast-tips"),
			contrastQuickBtn : $(".Js-show-contrast"),
			type : "",
			max : "",
			init : null,
			checkFun : null,
			unCheckFun : null,
			callback : null
		};
	$.extend(option, options);
	// set common param

	$.extend(option, {
		addResult : function(data){
			var $check = option.mainWrap.find("input").filter("[data-id=" + data.id + "]"),
				contrast = ""
			data.hasPrice = data.price ? "" : "fn-hide";
			data.hasImage = data.image ? "has-image" : "";
			data.image = data.image ? data.image : ( base + "/images/lib/i.gif" );
			option.contrastList.append( $.getFromTemplate( option.contrastTemp, $.extend(data, { type : option.type }) ) );
			if( option.contrastList.children().length > 1 ){
				option.contrastBtn.addClass( option.contrastBtnClass );
			}
			if ( typeof( option.checkFun ) == "function" ) {
				contrast = option.mathContrast();
				option.checkFun( $check, contrast );
			}
		},
		removeResult : function(id){
			var $check = option.mainWrap.find("input").filter("[data-id=" + id + "]"),
				$item = option.contrastList.find(option.contrastItem).filter("[data-id=" + id + "]"),
				contrast = "";
			$item.remove();
			if( $check.length > 0 ){
				$check.prop("checked", false);
			}
			if( option.contrastList.children().length < 2 ){
				option.contrastBtn.removeClass( option.contrastBtnClass );
			}
			if ( typeof( option.unCheckFun ) == "function" ) {
				option.unCheckFun($check);
			}
			// if ( typeof( option.checkFun ) == "function" ) {
			// 	contrast = option.mathContrast();
			// 	option.checkFun( $check, contrast );
			// }
		},
		doClearAll : function(){
			var $checks = option.mainWrap.find("input[name=" + option.checkGroupName + "]:checked");
			$checks.prop("checked", false);
			option.contrastList.find(option.contrastItem).remove();
			option.contrastBtn.removeClass( option.contrastBtnClass );
			if ( typeof( option.unCheckFun ) == "function" ) {
				option.unCheckFun($checks);
			}
		},
		wrapToggle : function(isOpen){
			if (isOpen) {
				option.contrastWrap.slideDown(300);
			}else{
				option.contrastWrap.slideUp(300);
			}
		},
		showMax : function(){
			if ( option.contrastTips.is(":hidden") ) {
				option.contrastTips.fadeIn(400).delay(1000).fadeOut(400);
			}
		},
		mathContrast : function(){
			var $item = option.contrastList.find(option.contrastItem);
			var formData = "";
			if ($item.length > 1) {
				$item.each(function(){
					formData += $(this).attr(option.checkVal.id) + "&";
				});
				formData = formData.replace(/&$/gi, "");
			}
			return formData;
		},
		doContrast : function(){
			var $item = option.contrastList.find(option.contrastItem);
			var formData = option.mathContrast();
			if ($item.length > 1) {
				if ( typeof( option.callback ) == "function" ) {
					option.callback(option, formData);
				}
			}
		}
	});

	// bind show contrast btn function
	option.contrastQuickBtn.on("click", function(){
		option.wrapToggle(true);
	});
	
	// checkbox change function
	option.mainWrap.on("change", ("input[name=" + option.checkGroupName + "]"), function(event){
		var checkData = {};
		// console.log(checkData);
		option.wrapToggle(true);
		if ($(this).is(":checked")) {
			if ( option.contrastList.children().length >= option.max  ){
				// console.log("max");
				$(this).prop("checked", false);
				option.showMax();
			}else{
				// console.log("can add");
				checkData = { id : $(this).attr(option.checkVal.id), name : $(this).attr(option.checkVal.name), price : $(this).attr(option.checkVal.price), image : $(this).attr(option.checkVal.image) };
				option.addResult( checkData );
			}
		}else{
			option.removeResult( $(this).attr(option.checkVal.id) );
		}
	});

	// bind contrast list to remove item by id
	option.contrastList.on("click", option.contrastRemoveBtn, function(){
		option.removeResult( $(this).attr(option.checkVal.id) );
	});

	// bind slideup function
	option.contrastWrap.on("click", option.contrastClose, function(){
		// option.doClearAll();
		option.wrapToggle(false);
	});

	// bind clear all function
	option.contrastWrap.find(option.contrastClearBtn).on("click", function(){
		option.doClearAll();
	});

	// bind contrast btn function
	option.contrastBtn.on("click", function(){
		if ( $(this).hasClass(option.contrastBtnClass) ) {
			option.doContrast();
		}
	});

	// init function
	// console.log("init contrast");
	if ( typeof(option.init) == "function" ) {
		option.init();
	}

}

/*******************************************************************************************************
 *	baiing View : $.cgTree()	level tree
 *	@param [options:wrap($obj)]							wrap's jquery dom
 *	@param [options:main(dom's class)]					all select checkbox
 *	@param [options:items(dom's class)]					checkboxs
 *	@param [options:on(function){checked dom}]			checked function
 *	@param [options:off(function){unchecked dom}]		unchecked function
 ********************************************************************************************************/
$.cgTree = function( options ) {
    var option = $.extend({
        wrap : $(".tree-list"),
        treeData : [],
        addClass : "",
        isPreFix : true,
        template : null,
        nodeFun : null,
        addOtherFun : null,
        addLastFun : null,
        callback : null
    }, options);
    var _arrTree = { root : [] },
    	_thisTreeData = [],
        _strTemp = $('<div><li style="margin-left:#{padding}px" id="color_#{id}" class="Js-tree-item #{status}" data-id="#{id}" data-lv="#{lv}" data-pid="#{pId}">'+
                        '<a href="javascript:void(0)"  class="tree-link Js-tree-link" data-id="#{id}">#{name}</a>'+
                    '</li></div>');
        _temp = option.template ? option.template : _strTemp,
        _createTree = function(item){
            var $item;
            if ( _arrTree[item.id] ) {
                item.hasChild = true;
                item.status = "on";
                $item = option.addItem(item);
                if ( typeof(option.addOtherFun) == "function" ) {
                    option.addOtherFun($item, item);
                }
                $.each(_arrTree[item.id], function(i, t){
                    t.lv = Math.floor(item.lv) + 1;
                    _createTree(t);
                });
            }else{
                item.hasChild = false;
                item.status = "last";
                $item = option.addItem(item);
                if ( typeof(option.addLastFun) == "function" ) {
                    option.addLastFun($item, item);
                }
            }
        };
    $.extend(option, {
        addItem : function(item){
            item.padding = item.lv * 20;
            item.newID = item.id;
            if ( option.isPreFix ) {
                var _r = new RegExp( "^" + item.prefix , "gi" );
                item.newID = item.newID.replace(_r, "");
            }else{
                item.prefix = undefined;
            }
            var $li = $.getFromTemplate( _temp, item );
            option.wrap.append( $li );
            return $li;
        },
        openRoot : function(){
            option.wrap.find(".Js-tree-item").hide().filter(".on").removeClass("on").addClass("off");
            $.each(_arrTree.root, function(index, item){
                option.wrap.find(".Js-tree-item[data-id='" + item.newID + "'][data-prefix='" + item.prefix + "']").show().removeClass("off").addClass("on");
                if ( !!_arrTree[item.id] ) {
                    $.each(_arrTree[item.id], function(i, t){
                        option.wrap.find(".Js-tree-item[data-id='" + t.newID + "'][data-prefix='" + t.prefix + "']").show().filter(".on").removeClass("on").addClass("off");
                    });
                }
            });
        },
        openSelected : function(id, prefix){
            // console.log(id, prefix);
            var _id = id;
            if ( !!prefix ) {
                id = prefix + id;
            }
            if ( !!_arrTree[id] ){
                option.wrap.find(".Js-tree-item[data-id='" + _id + "'][data-prefix='" + prefix + "']").removeClass("off").addClass("on");
                $.each(_arrTree[id], function(index, item){
                    option.wrap.find(".Js-tree-item[data-id='" + item.newID + "'][data-prefix='" + item.prefix + "']").show();
                });
            }
        },
        closeSelected : function(id, prefix){
            // console.log(id, prefix);
            var _id = id;
            if ( !!prefix ) {
                id = prefix + id;
            }
            // console.log(id);
            if ( _arrTree[id] ){
                option.wrap.find(".Js-tree-item[data-id='" + _id + "'][data-prefix='" + prefix + "']").removeClass("on").addClass("off");
                $.each(_arrTree[id], function(index, item){
                    option.wrap.find(".Js-tree-item[data-id='" + item.newID + "'][data-prefix='" + item.prefix + "']").hide();
                    var _closeID = item.id;
                    if ( option.isPreFix ) {
                        var _r = new RegExp( "^" + item.prefix , "gi" );
                        _closeID = _closeID.replace(_r, "");
                    }
                    option.closeSelected(_closeID, item.prefix);
                });
            }
        }
    });
    // parse data
    _thisTreeData = [].concat(option.treeData);
    $.each(_thisTreeData, function(index, item){
        // console.log(item);
        if( (item.open != undefined && item.open) || item.pId == "null" || item.pId == null ){
            item.lv = 0;
            _arrTree.root.push(item);
        }else{
            if (!_arrTree[item.pId]) {
                _arrTree[item.pId] = [];
            }
            _arrTree[item.pId].push(item);
        }
    });
    // console.log(_arrTree.root);
    // init create tree
    $.each(_arrTree.root, function(index, item){
        _createTree(item);
    });
    // bind click fun
    option.wrap.on("click", ".Js-tree-item", function(event){
        var $item = $(this),
            _id = $item.data("id"),
            _preFix = $item.data("prefix"),
            $element = $(event.target);
        if ( $element.hasClass("Js-tree-link") || $element.hasClass("Js-tree-icon") ) {
            if ( option.addClass != "" ) {
                option.wrap.children(".cur").removeClass( option.addClass );
                $item.addClass( option.addClass );
            }
            if ( $element.hasClass("Js-tree-link") && typeof(option.nodeFun) == "function" )  {
                option.nodeFun($item, option, _id);
                // return false;
            }
            if ( $item.hasClass("off") ) {
                if ( option.isPreFix ) {
                    option.openSelected(_id, _preFix);
                } else{
                    option.openSelected(_id);
                }
            } else if ( $item.hasClass("on") ) {
                if ( option.isPreFix ) {
                    option.closeSelected(_id, _preFix);
                } else{
                    option.closeSelected(_id);
                }
            }
        }
    });
    if ( typeof(option.callback) == "function" ) {
        option.callback(option);
    }
};

/*******************************************************************************************************
*	baiing View : $.cgDrag()	
*	@param [options:wrap(jquery dom)]			*wrap jquery's dom
*	@param [options:item(jquery dom)]			*drag jquery's dom	 
*	@param [options:drag(class name)]			*drag dom's class	
*	@param [options:resize(object:on)]			resize is used		 
*	@param [options:resize(object:dom)]			resize jquery's dom	 
*	@param [options:resize(object:drag)]		resize dom's class		 
*	@param [options:resize(object:square)]		resize is square		 
*	@param [options:resize(object:down)]		resize mouse down function 		 
*	@param [options:resize(object:move)]		resize mouse down function 		 
*	@param [options:resize(object:up)]			resize mouse down function 		 
*	@param [options:width(num)]					if false, all button hide without close button
*	@param [options:height(num)]				if false, cancel button hide
*	@param [options:onDown(fun)]				drag mouse down function 
*	@param [options:onMove(fun)]				drag mouse move function
*	@param [options:onUp(fun)]					drag mouse up function
********************************************************************************************************/
$.cgDrag = function(options){
	var option = $.extend({
		wrap : $(".wrap"),
		item : ".item",
		drag : "hook",
		resize : {
			on : false,
			dom : ".dom",
			drag : "dom",
			square : false,
			down : function(){},
			move : function(width, left, top){},
			up : function(width, left, top){}
		},
		width : 400,
		height : 400,
		onDown : function(option, page, dom){},
		onMove : function(option, page, dom){},
		onUp : function(option, page, dom){}
	}, options);

	var _page = {
			dl : 0,
			dt : 0,
			ml : 0,
			mt : 0,
			ol : 0,
			ot : 0,
			position : 0
		},
		$drag = option.wrap.find( option.item ),
		_itemW = _itemH = _itemRW = _itemRH = 0;
	// drag
	option.wrap.on("mousedown", option.item, function(event){
		// console.log(event);
		event.preventDefault();
		if ( $(event.target).hasClass( option.drag ) ) {
			var _position = $drag.position();
			_page.posLeft = _position.left;
			_page.posTop = _position.top;
			_page.dl = event.pageX;
			_page.dt = event.pageY;
			option.onDown(option, _page, $drag);
			// console.log(_position);
			$(document).on("mousemove", function(e){
				e.preventDefault();
				_page.ml = e.pageX;
				_page.mt = e.pageY;
				_page.ol = _page.ml - _page.dl;
				_page.ot = _page.mt - _page.dt;
				option.onMove(option, _page, $drag);
			});
			$(document).one("mouseup", function(){
				option.onUp(option, _page, $drag);
				$(document).off("mousemove");
			});
		}
	});
	// resize
	if ( option.resize.on ) {
		option.wrap.on("mousedown", option.resize.dom, function(event){
			// console.log(event);
			event.preventDefault();
			if ( $(event.target).hasClass( option.resize.drag ) ) {
				var _position = $drag.position();
				_itemW = $drag.width();
				_itemH = $drag.height();
				_page.posLeft = _position.left;
				_page.posTop = _position.top;
				// console.log(_position);
				$(document).on("mousemove", function(e){
					e.preventDefault();
					_itemRW = e.pageX - event.pageX + _itemW;
					_itemRH = e.pageY - event.pageY + _itemH;
					
					_itemRW = _itemRW + _position.left > option.width ? option.width - _position.left : _itemRW;
					_itemRH = _itemRH + _position.top > option.height ? option.height - _position.top : _itemRH;
					if ( option.resize.square ) {
						if ( _itemRW >= _itemRH ) {
							$drag.width( _itemRH );
							$drag.height( _itemRH );
						}else{
							$drag.width( _itemRW );
							$drag.height( _itemRW );
						}
					}else{
						$drag.width( _itemRW );
						$drag.height( _itemRH );
					}
					option.resize.move(_itemRW, _position.left, _position.top);
				});
				$(document).one("mouseup", function(){
					$(document).off("mousemove");
				});
			}
		});
	}
};

/*******************************************************************************************************
*	baiing View : $.cgDrag()	
*	@param [options:wrap(jquery dom)]				*wrap jquery's dom
*	@param [options:normalBox(object:dom)]			normalBox jquery's dom	 
*	@param [options:normalBox(object:img)]			normalBox img jquery's dom	 
*	@param [options:normalBox(object:drag)]			normalBox drag jquery's dom
*	@param [options:normalBox(object:dragClass)]	normalBox drag dom's class	 
*	@param [options:normalBox(object:resize)]		normalBox drag jquery's dom	 
*	@param [options:normalBox(object:resizeClass)]	normalBox drag dom's class
*	@param [options:normalBox(object:width)]		normalBox width		 
*	@param [options:normalBox(object:height)]		normalBox height	 
*	@param [options:middleBox(object:dom)]			middleBox jquery's dom	 
*	@param [options:middleBox(object:img)]			middleBox img jquery's dom	 
*	@param [options:middleBox(object:width)]		middleBox width		 
*	@param [options:middleBox(object:height)]		middleBox height
*	@param [options:minBox(object:dom)]				minBox jquery's dom	 
*	@param [options:minBox(object:img)]				minBox img jquery's dom	 
*	@param [options:minBox(object:width)]			minBox width		 
*	@param [options:minBox(object:height)]			minBox height
*	@param [options:file(jquery dom)]				file input jquery's dom
*	@param [options:submitBtn(jquery dom)]			upload jquery's dom
*	@param [options:onSubmit(fun)]					upload photo function
********************************************************************************************************/
$.cgCPUpload = function(options){
	var option = $.extend({
		wrap : $(".wrap"),
		normalBox : {
			dom : ".normalBox",
			img : ".img",
			drag : ".drag", 
			dragClass : "drag", 
			resize : ".resize", 
			resizeClass : "resize", 
			width : 300,
			height : 300
		},
		middleBox : {
			dom : ".middleBox",
			img : ".img",
			width : 200,
			height : 200
		},
		minBox : {
			has : false,
			dom : ".minBox",
			img : ".img",
			width : 100,
			height : 100
		},
        resize : false,
		file : ".file",
		submitBtn : ".btn",
		onSubmit : function(option){}
	}, options);
	var _imgFlag = false;
    var _citeW = _citeH = _citeMW = _citeMH = _middleImgSize = _minImgSize = 0;
    var _editImg = function(dom, size, w, h, l, t){
        // console.log(size, w, h, l, t);
        dom.css({
            width : w / size,
            height : h / size,
            left : "-"+ l / size + "px",
            top : "-"+ t / size + "px"
        });
    };
    // option.wrap.on("change", option.file, function(event){
    // 	option.normalBox.img.removeAttr("style"); // init img
    // 	var _src = $(this).val();
    //     if (typeof FileReader !== "undefined"){
    //         var _file = event.target.files[0];
    //         var reader = new FileReader();
    //         reader.onload = (function(file){
    //             return function(e){
    //                 // console.log(e);
    //                 _src = e.target.result;
    //                 option.normalBox.img.attr("src", _src);
    //                 option.middleBox.img.attr("src", _src);
    //                 option.minBox.img.attr("src", _src);
    //             };
    //         })(_file);
    //         reader.readAsDataURL(_file); // important must be have
    //     }else{
    //     	option.normalBox.img.attr("src", _src);
    //         option.middleBox.img.attr("src", _src);
    //         option.minBox.img.attr("src", _src);
    //     }
    //     _imgFlag = true;
    // });
	option.normalBox.img.attr("src", option.imgSrc);
    option.middleBox.img.attr("src", option.imgSrc);
    if ( option.minBox.has ) {
    	option.minBox.img.attr("src", option.imgSrc);
    }
	_imgFlag = true;
    option.normalBox.img.load(function(){
        if (_imgFlag) {
            var _$img = $(this),
                _width = _$img.width(),
                _height = _$img.height(),
                _maxSize = Math.max( _width, _height ),
                _minSize = Math.min( _width, _height ),
                _bigType = _width >= _height ? "width" : "height";
            if ( _minSize > 300 || _maxSize > 300 ) {
                _$img.css(_bigType, 300);
            }
            _citeMW = _$img.width();
            _citeMH = _$img.height();
            _middleImgSize = 100 / option.middleBox.width;
            _minImgSize = 100 / 100;
            _editImg(option.middleBox.img, _middleImgSize, _citeMW, _citeMH, 0, 0);
            if ( option.minBox.has ) {
	            _editImg(option.minBox.img, _minImgSize, _citeMW, _citeMH, 0, 0);
	        }
            option.normalBox.drag.show().css({
                left : 0,
                top : 0,
                width : 100,
                height : 100
            });
        }
    });
    option.wrap.on("click", option.submitBtn, function(){
    	option.onSubmit(option);
    	// console.log("fuck");
    });

    $.cgDrag({
        wrap : option.normalBox.dom,
        item : option.normalBox.drag,
        drag : option.normalBox.dragClass,
        resize : {
            on : option.resize,
            dom : option.normalBox.resize,
            drag : option.normalBox.resizeClass,
            square : true,
            move : function(w, l, t){
                _middleImgSize = 100 / option.middleBox.width * w / 100;
                _minImgSize = w / 100;
                _editImg(option.middleBox.img, _middleImgSize, _citeMW, _citeMH, l, t);
                if ( option.minBox.has ) {
	                _editImg(option.minBox.img, _minImgSize, _citeMW, _citeMH, l, t);
	            }
            }
        },
        width : 300,
        height : 300,
        onDown : function(opt, page, $dom){
            _citeW = Math.floor( $dom.width() ) + 4;
            _citeH = Math.floor( $dom.height() ) + 4;
            _middleImgSize = 100 / option.middleBox.width * _citeW / 100;
            _minImgSize = _citeW / 100;
        },
        onMove : function(opt, page, $dom){
            var _ol = page.ol + page.posLeft,
                _ot = page.ot + page.posTop;
            // _ol = _ol >= 0 ? _ol + _citeW > _citeMW ? _citeMW - _citeW : _ol : 0;
            // _ot = _ot >= 0 ? _ot + _citeH > _citeMH ? _citeMH - _citeH : _ot : 0;
            _ol = _ol >= 0 ? _ol + _citeW > 300 ? 300 - _citeW : _ol : 0;
            _ot = _ot >= 0 ? _ot + _citeH > 300 ? 300 - _citeH : _ot : 0;
            $dom.css("left", _ol);
            $dom.css("top", _ot);  
            _editImg(option.middleBox.img, _middleImgSize, _citeMW, _citeMH, _ol, _ot);  
            if ( option.minBox.has ) {
	            _editImg(option.minBox.img, _minImgSize, _citeMW, _citeMH, _ol, _ot);  
	        }
        },
        onUp : function(opt, page, dom){}
    });
};


$.parseDate = function (date, format) {
        if (date.constructor == Date) {
            return new Date(date);
        }
        var parts = date.split(/\W+/);
        var against = format.split(/\W+/), d, m, y, h, min, now = new Date();
        for (var i = 0; i < parts.length; i++) {
            switch (against[i]) {
                case 'd':
                case 'e':
                    d = parseInt(parts[i],10);
                    break;
                case 'm':
                    m = parseInt(parts[i], 10)-1;
                    break;
                case 'Y':
                case 'y':
                    y = parseInt(parts[i], 10);
                    y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
                    break;
                case 'H':
                case 'I':
                case 'k':
                case 'l':
                    h = parseInt(parts[i], 10);
                    break;
                case 'P':
                case 'p':
                    if (/pm/i.test(parts[i]) && h < 12) {
                        h += 12;
                    } else if (/am/i.test(parts[i]) && h >= 12) {
                        h -= 12;
                    }
                    break;
                case 'M':
                    min = parseInt(parts[i], 10);
                    break;
            }
        }
        return new Date(
            y === undefined ? now.getFullYear() : y,
            m === undefined ? now.getMonth() : m,
            d === undefined ? now.getDate() : d,
            h === undefined ? now.getHours() : h,
            min === undefined ? now.getMinutes() : min,
            0
        );
    };
$.formatDate = function(date, format){
        var m = date.getMonth();
        var d = date.getDate();
        var y = date.getFullYear();
        var wn = date.getWeekNumber();
        var w = date.getDay();
        var s = {};
        var hr = date.getHours();
        var pm = (hr >= 12);
        var ir = (pm) ? (hr - 12) : hr;
        var dy = date.getDayOfYear();
        if (ir == 0) {
            ir = 12;
        }
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var parts = format.split(''), part;
        for ( var i = 0; i < parts.length; i++ ) {
            part = parts[i];
            switch (parts[i]) {
                case 'a':
                    part = date.getDayName();
                    break;
                case 'A':
                    part = date.getDayName(true);
                    break;
                case 'b':
                    part = date.getMonthName();
                    break;
                case 'B':
                    part = date.getMonthName(true);
                    break;
                case 'C':
                    part = 1 + Math.floor(y / 100);
                    break;
                case 'd':
                    part = (d < 10) ? ("0" + d) : d;
                    break;
                case 'e':
                    part = d;
                    break;
                case 'H':
                    part = (hr < 10) ? ("0" + hr) : hr;
                    break;
                case 'I':
                    part = (ir < 10) ? ("0" + ir) : ir;
                    break;
                case 'j':
                    part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
                    break;
                case 'k':
                    part = hr;
                    break;
                case 'l':
                    part = ir;
                    break;
                case 'm':
                    part = (m < 9) ? ("0" + (1+m)) : (1+m);
                    break;
                case 'M':
                    part = (min < 10) ? ("0" + min) : min;
                    break;
                case 'p':
                case 'P':
                    part = pm ? "PM" : "AM";
                    break;
                case 's':
                    part = Math.floor(date.getTime() / 1000);
                    break;
                case 'S':
                    part = (sec < 10) ? ("0" + sec) : sec;
                    break;
                case 'u':
                    part = w + 1;
                    break;
                case 'w':
                    part = w;
                    break;
                case 'y':
                    part = ('' + y).substr(2, 2);
                    break;
                case 'Y':
                    part = y;
                    break;
            }
            parts[i] = part;
        }
        return parts.join('');
    };

$.agotime = function( timestamp ) {
    var nowTimeStamp = Date.parse(new Date()) * 1000,
        nowDate = new Date(),
        nowFormatDate = $.formatDate( nowDate, 'Ymd'),

        theTimeStamp = timestamp,
        theDate = new Date( theTimeStamp ),
        theFormatDate = $.formatDate( theDate, 'Ymd'),

        yesterdayDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 1),
        yesterdayTimeStamp = Date.parse( yesterdayDate ),
        yesterdayFormatDate = $.formatDate( yesterdayDate, 'Ymd'),
        
        difference = nowTimeStamp - theTimeStamp,

        hour = ( theDate.getHours() < 10 )? '0' + theDate.getHours() : theDate.getHours(),
        min = ( theDate.getMinutes() < 10 )? '0' + theDate.getMinutes() : theDate.getMinutes(),
        day = ( theDate.getDate() < 10 )? '0' + theDate.getDate() : theDate.getDate();
    // console.log(nowTimeStamp , theTimeStamp, difference);
    if( difference <= 0 ){
        return '刚刚' ;
    }
    else if( difference < 60000 ){
        return Math.floor( difference / 1000 ) + ' 秒之前' ;
    }
    else if( difference <  60000 * 60 ) {
        return Math.floor( difference / 60000 ) + ' 分钟之前' ;
    }
    else if(
        nowFormatDate == theFormatDate
    ) {
        return '今天 ' +  hour + ':' + min;
    }
    else if(
        yesterdayFormatDate == theFormatDate
    ) {
        return '昨天 ' +  hour + ':' + min;
    }
    else if( nowDate.getFullYear() == theDate.getFullYear() ){
        return theDate.getMonthName() + day + "日 " + hour + ':' + min;
    }
    return  theDate.getFullYear() + '年' + theDate.getMonthName() + theDate.getDate() + '日';
    
};

var extendDate = function(options) {
    var options = $.extend({
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            weekMin: 'wk'
        },
        options
    );

    // var options = $.extend({
    //         days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    //         daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //         daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    //         months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    //         monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    //         weekMin: 'wk'
    //     },
    //     options
    // );

    if (Date.prototype.tempDate) {
        return;
    }
    Date.prototype.tempDate = null;
    Date.prototype.months = options.months;
    Date.prototype.monthsShort = options.monthsShort;
    Date.prototype.days = options.days;
    Date.prototype.daysShort = options.daysShort;
    Date.prototype.getMonthName = function(fullName) {
        return this[fullName ? 'months' : 'monthsShort'][this.getMonth()];
    };
    Date.prototype.getDayName = function(fullName) {
        return this[fullName ? 'days' : 'daysShort'][this.getDay()];
    };
    Date.prototype.addDays = function (n) {
        this.setDate(this.getDate() + n);
        this.tempDate = this.getDate();
    };
    Date.prototype.addMonths = function (n) {
        if (this.tempDate == null) {
            this.tempDate = this.getDate();
        }
        this.setDate(1);
        this.setMonth(this.getMonth() + n);
        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
    };
    Date.prototype.addYears = function (n) {
        if (this.tempDate == null) {
            this.tempDate = this.getDate();
        }
        this.setDate(1);
        this.setFullYear(this.getFullYear() + n);
        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
    };
    Date.prototype.getMaxDays = function() {
        var tmpDate = new Date(Date.parse(this)),
            d = 28, m;
        m = tmpDate.getMonth();
        d = 28;
        while (tmpDate.getMonth() == m) {
            d ++;
            tmpDate.setDate(d);
        }
        return d - 1;
    };
    Date.prototype.getFirstDay = function() {
        var tmpDate = new Date(Date.parse(this));
        tmpDate.setDate(1);
        return tmpDate.getDay();
    };
    Date.prototype.getWeekNumber = function() {
        var tempDate = new Date(this);
        tempDate.setDate(tempDate.getDate() - (tempDate.getDay() + 6) % 7 + 3);
        var dms = tempDate.valueOf();
        tempDate.setMonth(0);
        tempDate.setDate(4);
        return Math.round((dms - tempDate.valueOf()) / (604800000)) + 1;
    };
    Date.prototype.getDayOfYear = function() {
        var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
        var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
        var time = now - then;
        return Math.floor(time / 24*60*60*1000);
    };
};

extendDate();

}(jQuery));