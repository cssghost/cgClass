/** 
* @fileOverview cg classes 
* @author xu chen
* @date：2013-10-15
* @update：2013-10-15
* @version 0.1 
*/ 

var cgClass = {};

/** 
* @author xu chen 
* @constructor BaseClass 
* @return {Object} 基础类
* @description 生成基础js类 
* @example new cgClass.BaseClass(parentClass); 
* @since version 0.1 
* @param {Object} parent parentClass 
*/ 
cgClass.BaseClass = function(parent){
    var _class = function(){
        this.init.apply(this, arguments);
    };
    // Inherit
    if ( parent ) {
    	var subClass = function(){};
    	subClass.prototype = parent.prototype;
    	_class.prototype = new subClass;
    }
    _class.prototype.init = function(){};
    _class.fn = _class.prototype;
    _class.fn.parent = _class;
	_class._super = _class.__proto__;

	_class.attrs = function(obj){
		var included = obj.included;
		for( var i in obj ){
			_class[i] = obj[i];
		}
		if ( included ) {
			included( _class );
		}
	}

	_class.extend = function(obj){
		var extended = obj.extended;
		for( var i in obj ){
			_class.fn[i] = obj[i];
		}
		if ( extended ) {
			extended( _class );
		}
	}

    return _class;
};



