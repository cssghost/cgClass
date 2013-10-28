cgClass.AddClass(
	"test",
	{
		init : function(options){
			var self = this;
			// console.log(self);
			console.log(options);
			self.hello = "hello";
			// console.log(arg);
		},
		editView : function(value){
			var self = this;
			self.view = value;
		},
		setView : function(value){
			var self = this;
			self.set("view", value); 
		},
		showView : function(){
			var self = this;
			// console.log(self);
			self.view = "value";
			// console.log(self.view);
			// console.log(self.get("view") );
			// console.log(self.hello);
		}
	}
);