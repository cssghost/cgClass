cgClass.AddClass(
	"Popup",
	{
		init : function (options) {
			var self = this;
			self.test = "holle world";
			self.dom = $("div");
			self.outParam = self.applyMethods({
				option : options,
				close : self.close,
				test : "test"
			});
			options.callback(self.outParam);
		},
		close : function(value){
			var self = this;
			console.log(self.test, value);
		}
	}
);