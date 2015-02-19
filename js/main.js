var andrew = function(jQuery) {
	  var model = {
		init: function() {

		},
		the_data: [],
		
		parseData: function(data) {
		  var location = data.current_observation.observation_location.full;
		  var currentTemp = data.current_observation.temp_f;
		  return currentReadings 
		} 
	  };
	  
	  var controller = {
		init: function() {
		  this.getWeather()
		  view1.init();
		  view1.render();
		},
		getWeather: function() {
		  $.ajax({
			  url: "http://api.wunderground.com/api/49ef740b3b58e7ce/conditions/q/CA/San_Francisco.json",
			  dataType: 'jsonp'
		    })
		    .done( function(data) { model.parseData(data); } )
			.fail( function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});
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
