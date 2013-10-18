cgClass.AddClass(
	"ChooseArea",
	{
		init : function(options){
			var self = this;
			self.option = $.extend({
				wrap : $(".wrap"),
				text : ".text",
				autoList : "autoList",
				autoItem : ".Js-auto-item",
				focusWrap : ".focusWrap",
				focusWrapItem : ".Js-area-item",
				hoverClass : "hoverClass",
				init : function(){},
				createSearchList : function(){},
				action : function(){}
			}, options, {
				closeList : function(){
					self.option.wrap.find(self.option.focusWrap).hide();
				},
				createList : function(){
					self.createList.apply(self, arguments);
				}
			});

			self.outOpt = {
				createList : function(){
					self.createList.apply(self, arguments);
				}
			}

			// bind list
			self.bindList();

			// bind text 
			self.bindText();

			// bind focus wrap
			self.bindFocusWrap();

			// do init
			if ( typeof self.option.init == "function" ) {
				self.option.init(self.outOpt);
			}
		},
		bindList : function(){
			var self = this,
				$wrap = self.option.wrap,
				$text = $wrap.find(self.option.text),
				$list = $wrap.find(self.option.autoList);
			$list.on("mouseenter", self.option.autoItem, function(){
				$(this).addClass(self.option.hoverClass);
			}).on("mouseleave", self.option.autoItem,function(){
				$(this).removeClass(self.option.hoverClass);
			});

			$list.on("click", self.option.autoItem, function(){
			    $list.hide();
			    if ( typeof( self.option.action ) == "function" ) {
			    	self.option.action(self.option, $.trim( $(this).children().attr("title") ), $(this) );
			    }	
			    // self.option._returnText( $(this).children().attr("title") );
			});
		},
		bindText : function(){
			var self = this,
				$wrap = self.option.wrap,
				$text = $wrap.find(self.option.text),
				$list = $wrap.find(self.option.autoList),
				$focusWrap = $wrap.find(self.option.focusWrap),
				keys = {
					back: 8,
					enter:  13,
					escape: 27,
					up:     38,
					down:   40,
					array:  [13, 27, 38, 40]
				},keyDate = [], chooseData = [];
			$text.on("focus", function(){
				$focusWrap.show();
			}).on("keyup", function(event){
				var keyCode = event.keyCode;
				keyDate.push((new Date()).getTime());
				var thisTime = keyDate[(keyDate.length - 1)];
				var val = "";
				if( $focusWrap.is(":visible") ){
					$focusWrap.hide();
				}
				if($.inArray(keyCode, keys.array) !=-1){
					if( $list.is(":visible") ){
						var $item = $list.children(self.option.autoItem),
							$cur = $item.filter("." + self.option.hoverClass);
						switch (keyCode){
							case keys.up:
								if ( $cur.length ){
									$item.removeClass(self.option.hoverClass);
									$cur.prev().addClass(self.option.hoverClass);
								}else{
									$item.last().addClass(self.option.hoverClass);
								}
							break;
							case keys.down:
								if ( $cur.length ){
									$item.removeClass(self.option.hoverClass);
									$cur.next().addClass(self.option.hoverClass);
								}else{
									$item.first().addClass(self.option.hoverClass);
								}
							break;
							case keys.enter:
								$list.hide();
								if ( typeof( self.option.action ) == "function" ) {
									if ( $cur.length ) {
										$cur.click();
									} else{
										self.option.action(self.option, $.trim( $text.val() ), $cur );
									}
								}
							break;
							default :
							break;
						}
					}
				}else{
					// 延时显示searchlist 减少多余查询
					setTimeout(function(){
						val = $.trim( $text.val() );
						if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
							self.createList(val);
						}else if ( val == "" ){
							$list.hide();
						}
					}, 300);
				}
			});
		},
		bindFocusWrap : function(){
			var self = this,
				$wrap = self.option.wrap,
				$text = $wrap.find(self.option.text),
				$list = $wrap.find(self.option.autoList),
				$focusWrap = $wrap.find(self.option.focusWrap);
			cgClass.Create(
				"Tag",
				{
					wrap : $focusWrap,
					tagList : ".area-tag-list",
					tagItem : "li",
					conList : ".area-con-list",
					conItem : ".con-item",
					selectClass : "selected"
				}
			);
			$focusWrap.on("click", self.option.focusWrapItem, function(){
				self.option.action(self.option, $(this).text() );
			});
		},
		createList : function(val){
			var self = this,
				$wrap = self.option.wrap,
				$list = $wrap.find(self.option.autoList);
			$list.show();
		}
	}
);