var andrew = function(jQuery) {
	  var model = {
		init: function() {

		},
		the_data: []
	  };
	  
	  var controller = {
		init: function() {
		  view1.init();
		  view1.render();
		}
	  };
	  
	  var view1 = {
		init: function() {
			console.log('hello weather');
			console.log(jQuery('p').text());
		},
		render: function() {
			
		}
	  };
	  
	  controller.init();
};
andrew(jQuery);
