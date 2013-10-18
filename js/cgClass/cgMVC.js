/** 
* @author xu chen 
* @name cgMVC 
* @constructor 
* @extends Base 
* @description MVC Object
* @since version 0.1 
*/ 
(function($, cgClass){
	/**
	* @name BaseMVC
	* @class 定义一个BaseMVC基础类
	*/
	var BaseMVC = new cgClass.BaseClass;


	BaseMVC.attrs(/** @lends BaseMVC.prototype*/{
		/**
         * 默认models
         * @type Object
         * @param {Object} classess
         * @param {Object} cache
         */
		models : {
			classes : {},
			cache : {}
		},
		/**
         * 默认views
         * @type Object
         * @param {Object} classess
         * @param {Object} cache
         */
		views : {
			classes : {},
			cache : {}
		}
	});

	BaseMVC.extend({
		editView : function(){
			var self = BaseMVC;
			self.models.classes["test"] = "haha";
		},
		showView : function(){
			var self = BaseMVC;
			console.log(self.models);
		}
	});

	var baiing = new BaseMVC;

	window.baiing = baiing;

	return ( window.baiing );

})( jQuery, cgClass );
// window.baiing.editView();
// window.baiing.showView();

// cgMVC.addClass = function(){
// 	var _class = new cgClass.BaseClass;
// 	return _class;
// };

// cgMVC.addModel = function(className, value){
// 	var className = className;
// 	if ( !!!cgMVC.models.classes[className] ) {
// 		var model = new cgMVC.addClass;
// 		cgMVC.models.classes[className] = model;
// 	}
// };

// cgMVC.getModel = function(className){
// 	var className = className;
// 	if ( !!!cgMVC.models.classes[className] ) {
// 		var newModel = new cgMVC.addClass;
// 		cgMVC.models.classes[className] = newModel;
// 	}
// 	var model = cgMVC.models.classes[className];
// 	return model;
// };

// (function($, cgMVC){
// 	console.log(cgMVC);
// 	var testModelTwo = cgMVC.getModel("testTwo");
// 	var testModel = cgMVC.addModel("test");
// 	testModel.extend({
// 		log : "hello word",
// 		showView : function(){
// 			console.log("show view");
// 		}
// 	});
// })(jQuery, cgMVC);

// (function($, cgMVC){
// 	console.log(cgMVC);
// 	var testModelTwo = cgMVC.addModel("testTwo");
// 	testModelTwo.extend({
// 		log : "hello word two",
// 		showView : function(){
// 			console.log("show view two");
// 		}
// 	});
// })(jQuery, cgMVC);


// var testModel = cgMVC.addModel("test");
// var testModelTwo = cgMVC.addModel("testTwo");


// console.log( cgMVC );

// testModel.extend({
// 	log : "hello word",
// 	showView : function(){
// 		console.log("show view");
// 	}
// });

// testModelTwo.extend({
// 	log : "hello word two",
// 	showView : function(){
// 		console.log("show view two");
// 	}
// });

// testModel.showView();
// testModelTwo.showView();






