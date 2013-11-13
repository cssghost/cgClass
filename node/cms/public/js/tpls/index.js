$(document).ready(function() {

	// change area
	$(".area-list").on("click", "a", function(event){
		var $area = $(event.target);
		if ($area.filter("[data-id]")) {
			var _id = $area.data("id"),
				_area = $area.text();
			$.ajax({
				url : base + "/scene/locationselector!switchLocation.do",
				data : { id : _id, name : _area},
				type : "post",
				dataType : "json",
				success : function(result){
					if (result.success) {
						window.location.reload();
					}
				},
				error : function(result){}
			});
		}
	});

	// bind nav animate
	$(".Js-change-nav-btn").on("click", function(){
		var $list = $(".Js-home-nav-list"),
			$topList = $list.filter(":first"),
			$bottomList = $list.filter(":last");
		$topList.children(":last").insertBefore( $topList.children(":first") );
		$bottomList.children(":first").insertAfter( $bottomList.children(":last") );
	});
	// bind auto complete
	$.cgAutoComplete({
		frameBox : $(".Js-auto-box"),
		autoList : ".Js-auto-list",
		autoItem : ".Js-auto-item",
		autoText : ".Js-auto-text",
		autoBtn : $(".Js-auto-btn"),
		hasBtn : true,
		hoverClass : "selected",
		titleClass : "",
		placeholder : "",
		isSearch : true,
		init : function(opt){},
		createSearchList : function(opt, val){
//			var _result = [
//			        "苹果 iPhone4S（16G）电信版测试用",
//			        "苹果 iPhone4S（16G）电信版测试用上市日期",
//			        "苹果 iPhone4S（16G）电信版测试用品牌",
//			        "苹果 iPhone4S（16G）电信版测试用型号",
//			        "苹果 iPhone4S（16G）电信版测试用价格",
//			        "苹果 iPhone4S（16G）电信版测试用手机类型",
//			        "苹果 iPhone4S（16G）电信版测试用外观类型",
//			        "苹果 iPhone4S（16G）电信版测试用主屏尺寸",
//			        "苹果 iPhone4S（16G）电信版测试用主屏比例",
//			        "苹果 iPhone4S（16G）电信版测试用主屏材质"
//			    ];
//			opt.list.empty();
//			$.each(_result, function( index, item ){
//				opt.addItem( $("#Js-frame-auto-search-item-template"), { title : item } );
//			});
//			opt.showList();
			 $.ajax({
				 	url : base + "/search!suggest.do?t=" + (new Date()).getTime(),
				 	data : {q : val},
				 	dataType : "json",
				 	success : function(result){
				 		if ( result.success ) {
				 			opt.list.empty();
				 			if ( result.list.constructor === Array && result.list.length ) {
				 				$.each(result.list, function( index, item ){
				 					opt.addItem( $("#Js-frame-auto-search-item-template"), { title : item } );
				 				});
				 				opt.showList();
				 			}else{
				 				opt.closeList();
				 			}
				 		}else{
				 			opt.closeList();
				 		}
				 	},
				 	error : function(result){
				 		opt.closeList();
				 	}
				 });
		},
		action : function(opt, val, $item){
			opt.text.val(val);
			$(".Js-search-q").val(val);
			$("#search_form").submit();
		}
	});	
});
function checkQ() {
    var _val = $.trim($(".Js-auto-text").val()),
        flag = false;
    $.ajax({
        type : "get",
        url : "/search!before.do?q=" + _val,
        data : "",
        dataType : "json",
        async : false,
        success : function(result, textStatus) {
            if ( result.success ) {
                window.open( result.url, '_blank' );
            }else{
                flag = true;
            }
        },
        error : function() {
            flag = true;
        }
    });
    if ( flag ){
        return true;
    }else{
        return false;
    }
}
function AddFavorite(sURL, sTitle){ 
	try { 
		window.external.addFavorite(sURL, sTitle); 
	} 
	catch (e)  { 
		try { 
			window.sidebar.addPanel(sTitle, sURL, ""); 
		} 
		catch (e) { 
			alert("加入收藏失败，请使用Ctrl+D进行添加"); 
		} 
	} 
} 
function SetHome(obj,vrl){ 
	try{ 
		obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl); 
	} 
	catch(e){ 
		if(window.netscape) { 
			try { 
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
			} 
			catch (e) { 
				alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。"); 
			} 
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); 
			prefs.setCharPref('browser.startup.homepage',vrl); 
		} 
	} 
} 
