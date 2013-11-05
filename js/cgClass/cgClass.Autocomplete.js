cgClass.AddClass(
    "Autocomplete",
    {
        init : function(options){
            var self = this,
                option = $.extend({
                    wrap : $(".Js-auto-frame"),
                    template : null,
                    autoList : ".Js-auto-list",
                    autoItem : ".Js-auto-item",
                    autoText : ".Js-auto-text",
                    autoBtn : $(".Js-auto-btn"),
                    hasBtn : true,
                    hoverClass : "selected",
                    init : function(option){},
                    action : function(option, val){},
                    createSearchList : function(option, val, addItem){}
                }, options),
                $wrap = option.wrap,
                $list = $wrap.find(option.autoList),
                $text = $wrap.find(option.autoText),
                $btn = $wrap.find(option.autoBtn),
                $temp = option.template || $('<div><li class="auto-item Js-auto-item hide-row"><a href="javascript:void(0)" title="#{title}">#{title}</a></li></div>'),
                keys = {
                    back: 8,
                    enter:  13,
                    escape: 27,
                    up:     38,
                    down:   40,
                    array:  [13, 27, 38, 40]
                },
                keyDate = [],
                chooseData = [];

            self.wrap = $wrap;
            self.list = $list;
            self.text = $text;
            self.btn = $btn;
            self.itemTemp = $temp;

            // out param
            self.outParam = self.applyMethods(self, {
                oWrap : $wrap,
                oList : $list,
                oText : $text,
                oBtn : $btn,
                returnText : self.returnText,
                addItem : self.addItem,
                showList : self.showList,
                closeList : self.closeList
            });


            // bind when auto item hover change item's class
            $wrap.on(
                "mouseenter",
                option.autoItem,
                function(){
                    $(this).addClass(option.hoverClass);
                }
            ).on(
                "mouseleave",
                option.autoItem,
                function(){
                    $(this).removeClass(option.hoverClass);
                }
            ).on(
            // bind when auto item clicked return function
                "click",
                option.autoItem,
                function(){
                    self.closeList();
                    if ( typeof( option.action ) == "function" ) {
                        option.action(self.outParam, $.trim( $(this).children().attr("title") ), $(this) );
                    }
                    self.returnText( $(this).children().attr("title") );
                }
            ).on(
            // bind when auto item keyup return function
                "keyup",
                option.autoText,
                function(event){
                    var keyCode = event.keyCode;
                    keyDate.push((new Date()).getTime());
                    var thisTime = keyDate[(keyDate.length - 1)];
                    var val = "";
                    if($.inArray(keyCode, keys.array) !=-1){
                        val = $.trim( $text.val() ); 
                        if ( $list.is(":hidden") && $list.children(option.autoItem).length ) {
                            self.showList();
                        }
                        var $item = $list.children(option.autoItem),
                            $cur = $item.filter("." + option.hoverClass);
                        switch (keyCode){
                            case keys.up:
                                if ( $cur.length ){
                                    $cur.removeClass(option.hoverClass).prev().addClass(option.hoverClass);
                                }else{
                                    $item.last().addClass(option.hoverClass);
                                }
                            break;
                            case keys.down:
                                if ( $cur.length ){
                                    $cur.removeClass(option.hoverClass).next().addClass(option.hoverClass);
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
                                        option.action(self.outParam, $.trim( $text.val() ), $cur );
                                    }
                                }
                            break;
                            default :
                            break;
                        }
                    }else{
                        // 延时显示searchlist 减少多余查询
                        setTimeout(function(){
                            val = $.trim( $text.val() );
                            if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
                                option.createSearchList(self.outParam, val);
                            }else if ( val == "" ){
                                self.closeList();
                            }
                        }, 300);
                    }
                }
            ).on(
            // bind when auto item keydown return function
                "keydown",
                option.autoText,
                function(event){
                    var keyCode = event.keyCode;
                    if ( keyCode == keys.back && $.trim( $(this).val() ) == "" && $list.is(":visible") ){
                        self.closeList();
                    }
                }
            ).on(
            // bind when auto item focus return function
                "focus",
                option.autoText,
                function(){
                    if( $.trim( $(this).val() ) != "" && $list.children().length && $list.is(":hidden") ){
                        self.showList();
                    }
                }
            );

            if ( option.hasBtn ) {
                option.autoBtn.on("click", function(){
                    self.closeList();
                    if ( typeof( option.action ) == "function" ) {
                        option.action(self.outParam, $.trim( $text.val() ) );
                    }
                });
            }

            // init
            if ( typeof option.init == "function" ) {
                option.init(self.outParam);
            }
        },
        returnText : function(value){
            this.text.val( $.trim(value) );
        },
        addItem : function(data){
            var self = this;
            self.list.empty();
            if ( data.constructor === Array && data.length ) {
                $.each(data, function(index, item){
                    self.list.append( $.getFromTemplate( self.itemTemp, item ) );
                });
                self.showList();
            }else{
                self.closeList();
            }
        },
        showList : function(){
            var self = this;
            self.list.slideDown("fast", "linear", function(){
                $(document).one("click", function(){
                    self.list.hide();
                });
            });
        },
        closeList : function(){
            this.list.hide();
        }
    }
);
