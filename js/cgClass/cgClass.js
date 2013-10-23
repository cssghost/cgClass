/** 
* @fileOverview cg classes 
* @author xu chen
* @date：2013-10-15
* @update：2013-10-15
* @version 0.1 
*/ 

/**
 * @author 徐晨
 * @name cgClass
 * @class 基础对象
 * @constructor
 * @example var cgClass = {};
 */

var cgClass = window.cgClass = { ajaxQueue : {} };


/**
 * @author 徐晨 
 * @name BaseClass
 * @class 创建基础js类
 * @constructor
 * @extends cgClass
 * @since version 0.1 
 * @param {Object} parent 可选参数，被继承类
 * @example var newClass = new cgClass.BaseClass(parentClass); 
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


	/**
	 * @name BaseClass#attrs
	 * @desc  为实体类添加属性
	 * @event
	 * @param {Object} obj 需要添加的属性
	 * @example 
	 * newClass.attrs({
	 *     key : "value"
	 * }); 
	 */
	_class.attrs = function(obj){
		var included = obj.included;
		for( var i in obj ){
			_class[i] = obj[i];
		}
		if ( included ) {
			included( _class );
		}
	}
	/**
	 * @name BaseClass#extend
	 * @desc  为实体类添加原型方法
	 * @event
	 * @param {Object} obj 需要添加的原型方法
	 * @example 
	 * newClass.extend({
	 *     key : function(arguments){}
	 * }); 
	 */
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

/**
 * @author 徐晨 
 * @name AddClass
 * @class 创建一个构造函数
 * @constructor
 * @extends cgClass
 * @since version 0.1 
 * @param {String} className 函数名称
 * @param {String} parent [可选] 父类函数名称
 * @param {Object} handler 原型方法的集合
 * @example
 * cgClass.AddClass(
 *     "ClassName",
 *     {
 *         init : function(options){},	
 *         test : function(){}	
 *     }
 * ); 
 */
cgClass.AddClass = function(className){
	var className = className;
	if ( !!cgClass[className] ) {
		alert("this class is had");
		return false;
	}
	var	_arguments = [].slice.apply(arguments),
		parent,
		handler = _arguments.slice(-1)[0];
	if ( !!_arguments[1] && typeof _arguments[1] == "string" ) {
		parent = _arguments[1];
	}
	function _Class(arg){
		this.outParam = {};
		this.init(arg);
		return this;
	}
	// Inherit
    if ( parent ) {
    	var subClass = function(){};
    	subClass.prototype = parent.prototype;
    	_Class.prototype = new subClass;
    }

    _Class.prototype.init = function(){};

    if ( !!handler && typeof handler == "object" ) {
	    for( var key in handler ){
	    	_Class.prototype[key] = handler[key];
	    }	
    }

    /**
	 * @name AddClass#applyMethods
	 * @desc  生成外部调用的对象 赋值于this.outParam并返回赋值
	 * @event
	 * @param {Object} _this 当前作用于this
	 * @param {Object} moethods 被复制对象
	 * @example applyMethods({
	 *     attrKey : value,
	 *     methodKey : function(arguments){}
	 * }); 
	 */
    _Class.prototype.applyMethods = function(_this, methods){
    	var self = this,
    		_methods = methods;
    	if ( !!_methods && typeof _methods == "object" ) {
		    for( var key in _methods ){
		    	if ( typeof _methods[key] == "function" ) {
		    		self.outParam[key] = function(){
		    			_methods[key].apply(_this, arguments);
		    		};
		    	}else{
		    		self.outParam[key] = _methods[key];
		    	}
		    }	
	    }
	    return self.outParam;
    }

	cgClass[className] = _Class;
};
/**
 * @author 徐晨 
 * @name Create
 * @class 创建一个新的实例
 * @constructor
 * @extends cgClass
 * @since version 0.1 
 * @param {String} className 实例名称
 * @param {Object} arg 实例默认参数
 * @param {Function} callback [可选] 回调函数
 * @param {Object} callback.self 生成的实例
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
cgClass.Create = function(className, arg, callback){
	var className = className,
		_class,
		arg = arg || {};
	if ( !!cgClass[className] ){
		_class = new cgClass[className](arg);
		if ( typeof callback == "function" ) {
			callback( _class );
		}else{
			return _class;
		}
	}else{
		var _script = document.createElement("script");  
		_script.type= 'text/javascript';  
		_script.onload = _script.onreadystatechange = function() {  
		    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) { 
		        _class = new cgClass[className](arg);
				if ( typeof callback == "function" ) {
					callback( _class );
				}
		        _script.onload = _script.onreadystatechange = null;  
		    }
		};  
		_script.src= "js/cgClass/cgClass." + className + ".js";  
		document.body.appendChild(_script);  
	}
};

/**
 * @author 徐晨 
 * @name Ajax
 * @class Ajax方法
 * @constructor
 * @extends cgClass
 * @extends jQuery
 * @since version 0.1 
 * @param {Object} config 配置对象
 * @example
 * cgClass.Ajax({
 *     url : "url",	
 *     data : {}	
 * }); 
 */
cgClass.Ajax = function(config, defData){
	var self = this,
		defData = defData || {},
		thisQueue,
		option = $.extend(
			{
				url : "url",
				type: "get",
				dataType: "json",
				queue : "",
				timeout: (30 * 1000),
				beforeSend : function(xhr, ajax){},
				success: function( response, statusText ){},
				error: function( request, statusText, error ){},
				complete: function( request, statusText ){
					console.log(statusText);
				}
			},
			config
		);

	option.data = $.extend(defData, option.data);

	if ( !!option.queue ) {
		var _ajaxQueue = self.ajaxQueue[option.queue];
		if ( !_ajaxQueue ) {
			_ajaxQueue = [];
		}
		_ajaxQueue.push(option.success);
		thisQueue = _ajaxQueue.length;
		self.ajaxQueue[option.queue] = _ajaxQueue;
	}

	return $.ajax( option );			
};


