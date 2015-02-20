var andrew = function(jQuery) {
	  var model = {
		init: function() {

		},
		the_data: {},
		the_forecast: {},
		
		saveData: function(data) {
		  var location,
		      currentTemp,
			  windchillString,
			  weather;
			  
		  location = data.current_observation.display_location.full;
		  currentTemp = data.current_observation.temperature_string;
		  windchill = data.current_observation.windchill_string;
		  weather = data.current_observation.weather;
		  
		  model.the_data.location = location;
		  model.the_data.currentTemp = currentTemp;
		  model.the_data.windchill = windchill;
		  model.the_data.weather = weather;
		},
		saveForecast: function(data) {
		  the_forecast = data.forecast.txt_forecast;
		  
		  console.log(the_forecast);
		}
	  };
	  
	  var controller = {
		init: function() {
		  this.getWeather();
		  this.getForecast();
		  view1.init();
		  view1.render();
		},
		getWeather: function() {
		  $.ajax({
			  url: "http://api.wunderground.com/api/49ef740b3b58e7ce/conditions/q/VA/Ashburn.json",
			  dataType: 'jsonp'
		    })
		    .done( function(data) { model.saveData(data); } )
			.fail( function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});
		},
		getForecast: function() {
		  $.ajax({
			  url: "http://api.wunderground.com/api/49ef740b3b58e7ce/forecast10day/q/VA/Ashburn.json",
			  dataType: 'jsonp'
		    })
		    .done( function(data) { model.saveForecast(data); } )
			.fail( function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});
		},
		getTheData: function() {
		  return model.the_data;
		}
	  };
	  
	  var view1 = {
		init: function() {
		  var $getBtn = $('#get-btn'),
		      $locationSpan = $('#location'),
			  $weatherSpan = $('#weather'),
			  $windchillSpan = $('#windchill'),
			  $currentTempSpan = $('#temp-current');
			  
		  $getBtn.on('click', function() {
				var data = controller.getTheData();
				$locationSpan.text(data.location);
				$currentTempSpan.text(data.currentTemp);
				$weatherSpan.text(data.weather);
				$windchillSpan.text('Windchill: ' + data.windchill);
			});
		},
		render: function() {
		  
		}
	  };
	  
	  controller.init();
	  
};
andrew(jQuery);
