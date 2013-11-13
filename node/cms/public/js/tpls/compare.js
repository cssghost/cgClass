$(document).ready(function() {
	// select dom html template
	var _createSelect = function(){
		var _htmlOption = "";
		$.each(compareSelect, function(key, item){
			_htmlOption += '<option value="' + key + '">' + item.label + '</option>';
		});
		var _htmlSelect = '<div class="choose-iphone">'+
								'<select class="Js-select-brand">'+
									'<option>请选择</option>'+
									_htmlOption + 
								'</select>'+
								'<select class="Js-select-prod">'+
									'<option>请选择</option>'+
								'</select>'+
								'<a class="btn btn-white Js-change-prod" href="javascript:void(0)"><span class="btn-text">提交</span></a>'+
							'</div>';
		return _htmlSelect;
	};
	var _baseHtmlSelect = _createSelect();
	// append select
	$(".contrast-table").find(".Js-compare-title td:empty").each(function(){
		$(this).html(_baseHtmlSelect);
	});
	// don't remove it, init table html
	// var _baseCompareHtml = $(".contrast-table").html(),
	// 	_repeatCompareHtml = null;
	// do hide same param whit $col
	var _parseCompare = function($col){
		for(var i = 0; i < $col.find("td").length; i++){
			_repeatTd( $col.find("td").eq(i) );
		}
	};
	// relate _parseCompare do hide same param whit $td
	var _repeatTd = function($td){
		var _$nextTd = $td.next("td"),
		_thisVal = $.trim( $td.text() ),
		_nextVal = $.trim( _$nextTd.text() );
		if ( _thisVal != "" && _$nextTd.length && _thisVal == _nextVal  ) {
			var _colspan = $td.attr("colspan") ? Math.floor( $td.attr("colspan") ) : 1;
			$td.attr("colspan",  _colspan + 1 );
			_$nextTd.remove();
			_repeatTd( $td );
		}
	};
	// do reset same param whit $col
	var _resetCompare = function($col){
		var _$td = $col.find("td[colspan]");
		_$td.each(function(){
			var _$thisTd = $(this),
				_colspan = Math.floor( _$thisTd.attr("colspan") );
			_$thisTd.attr("colspan", 1);
			if ( _colspan != 1 ) {
				for( var i = 1; i < _colspan; i++ ){
					_$thisTd.clone().insertAfter( _$thisTd );
				}
			}
		});
	};

	// bind toggle wrap
	$(".contrast-wrap").on("click", ".drawer", function(){
		var $toggle = $(this),
			$nextWrap = $toggle.closest("tbody").next("tbody");
		if ( $toggle.hasClass("open") ) {
			$toggle.removeClass("open");
			$nextWrap.show();
		} else{
			$toggle.addClass("open");
			$nextWrap.hide();
		}
	});
	// bind hide same param
	$(".contrast-wrap").on("change", ".Js-hide-compare", function(){
		var $toggle = $(this),
			$table = $(".contrast-table");
		$table.find(".drawer").removeClass("open");
		$table.find("tbody:hidden").show();
		// while do this function always to do all things
		if ( $toggle.prop("checked") ) {
			$table.find(".Js-col").each(function(){
				var $col = $(this);
				_parseCompare( $col );
			});
		} else{
			$table.find(".Js-col").each(function(){
				var $col = $(this);
				_resetCompare( $col );
			});
		}
		// don't remove, is less js to do hide same param in table, but not perfect
		// if ( $toggle.prop("checked") ) {
		// 	if ( !_repeatCompareHtml ) {
		// 		$table.find(".Js-col").each(function(){
		// 			var $col = $(this);
		// 			_parseCompare( $col );
		// 		});
		// 		_repeatCompareHtml = $(".contrast-table").html();
		// 	} else{
		// 		$(".contrast-table").html( _repeatCompareHtml );
		// 	}
		// } else{
		// 	$(".contrast-table").html( _baseCompareHtml );
		// }
	});
	// bind change brand
	$(".contrast-wrap").on("change", ".Js-select-brand", function(){
		var $select = $(this),
			$nextSelect = $select.next("select"),
			_chooseVal = $select.val(),
			_strOption = '<option>请选择</option>';
		if ( !!_chooseVal && _chooseVal != "请选择" ) {
			var nextSelectList = compareSelect[$select.val()].list;
			$.each(nextSelectList, function(index, item){
				if ( compareIds == compareIds.replace(item.id, "") ) {
					_strOption += '<option value="' + item.id + '">' + item.label + '</option>';
				}
			});
		}
		$nextSelect.html(_strOption);
	});
	// bind add prod
	$(".contrast-wrap").on("click", ".Js-change-prod", function(){
		var $secendSelect = $(this).closest("td").find(".Js-select-prod"),
			_typeID = $secendSelect.val();
		var $firstSelect = $(this).closest("td").find(".Js-select-brand"),
			_brandId = $firstSelect.val();
		if ( !!_typeID && _typeID != "请选择" ) {
			window.location.href = base + "/compare!list.do?ids=" + compareIds + "&" + "brand="+_brandId+"&type="+_typeID;
		}
	});
	// bind delete prod
	$(".contrast-wrap").on("click", ".del-btn", function(){
		var delID = $(this).data("id");
		window.location.href = base + "/compare!list.do?ids=" + compareIds.replace(delID, "").replace("\,\,", "\,").replace(/^\,|\,$/gi, "");
	});
});