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

var cgClass = window.cgClass = {};


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
	_class.proxy = function(func){
		var self = this;
		return(function(){
			return func.apply(self, arguments);
		});  
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
 * @param {Object} handler 原型方法的集合
 * @example
 * var newClass = new cgClass.AddClass(
 *     "ClassName",
 *     {
 *         init : function(options){},	
 *         test : function(){}	
 *     }
 * ); 
 */
cgClass.AddClass = function(className){
	var className = className,
		_arguments = [].slice.apply(arguments),
		parent,
		handler = _arguments.slice(-1)[0];
	if ( !!_arguments[1] && typeof _arguments[1] == "string" ) {
		parent = _arguments[1];
	}
	function _F(arg){
		var _class,
			arg = arg;

		// is have inherit
		if ( parent ) {
			_class = new cgClass.BaseClass(parent);
		} else{
			_class = new cgClass.BaseClass;
		}

		// add attrs for arguments
		if ( !!arg && typeof arg == "object" ) {
			_class.attrs(arg);
		}

		// add prototype methods
		if ( !!handler && typeof handler == "object" ) {
			_class.extend(handler);
		}

		var _init = _class.fn.init,
			_applyMethods = function(methods){
				var _methods = methods,
					_newMethods = {};
				if ( !!_methods && typeof _methods == "object" ) {
					for( var key in _methods ){
						if ( typeof _methods[key] == "function" ) {
							_newMethods[key] = function(){
								_methods[key].apply(this, arguments);
							};
						}else{
							_newMethods[key] = _methods[key];
						}
					}
				}
				return _newMethods;
			};

		_class.extend({
			// 重构默认init方法
			init : function(){
				_init.call(this, arg);
			},
			/**
			 * @name AddClass#get
			 * @desc  从内部原型中获取某属性值
			 * @event
			 * @param {String} attr 属性名称
			 * @example var attr = newClass.get("attrName"); 
			 */
			get : function(attr){
				return _class[attr];
			},
			/**
			 * @name AddClass#set
			 * @desc  设置内部原型中某属性值
			 * @event
			 * @param {String} attr 属性名称
			 * @param {Value} value 属性值
			 * @example var attr = newClass.set("attrName", "hello world!!"); 
			 */
			set : function(attr, value){
				_class[attr] = value;
			},
			/**
			 * @name AddClass#applyMethods
			 * @desc  设置内部原型中某属性值
			 * @event
			 * @param {String} attr 属性名称
			 * @param {Value} value 属性值
			 * @example var attr = newClass.set("attrName", "hello world!!"); 
			 */
			applyMethods : function(methods){
				var _methods = methods,
					_newMethods = {};
				if ( !!_methods && typeof _methods == "object" ) {
					for( var key in _methods ){
						if ( typeof _methods[key] == "function" ) {
							_newMethods[key] = _methods[key];
							// _newMethods[key] = function(){
							// 	_methods[key].apply(this, arguments);
							// };
						}else{
							_newMethods[key] = _methods[key];
						}
					}
				}
				return _newMethods;
			}
		});
		return new _class;
	}
	cgClass[className] = _F;
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
 * @example var newInstance = new cgClass.Create("className", { arg : "value" }); 
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


