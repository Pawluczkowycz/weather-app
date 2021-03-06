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
			  weather,
			  icon;
			  
		  location = data.current_observation.display_location.full;
		  currentTemp = data.current_observation.temperature_string;
		  windchill = data.current_observation.windchill_string;
		  weather = data.current_observation.weather;
		  icon = data.current_observation.icon_url;
		  
		  model.the_data.location = location;
		  model.the_data.currentTemp = currentTemp;
		  model.the_data.windchill = windchill;
		  model.the_data.weather = weather;
		  model.the_data.icon = icon;
		},
		saveForecast: function(data) {
		  model.the_forecast = data.forecast.txt_forecast;
		}
	  };
	  
	  var controller = {
		init: function() {
		  this.getWeather();
		  this.getForecast();
		  view1.init();
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
		    .done( function(data) {
				model.saveForecast(data);
				view2.init();
			} )
			.fail( function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});
		},
		getTheData: function() {
		  return model.the_data;
		},
		getTheForecast: function() {
		  return model.the_forecast;
		}
	  };
	  
	  // Current Conditions
	  var view1 = {
		init: function() {
		  this.getBtn = $('#get-btn');
		  this.locationSpan = $('#location');
		  this.weatherSpan = $('#weather');
		  this.windchillSpan = $('#windchill');
		  this.currentTempSpan = $('#temp-current');
		  this.icon = $('#icon');
		  this.getTodayBtn = $('#get-today');
		  
		  view1.render();
		},
		
		render: function() {
		  this.getBtn.on('click', function() {
		  view1.data = controller.getTheData();
		  view1.icon.attr('src', view1.data.icon);
		  view1.locationSpan.text(view1.data.location);
		  view1.currentTempSpan.text(view1.data.currentTemp);
		  view1.weatherSpan.text(view1.data.weather);
		  view1.windchillSpan.text('Windchill: ' + view1.data.windchill);
		  });
		}
	  };
	  
	  // Ten Day Forecast
	  var view2 = {
		init: function() {		  
		  this.getTenDaysBtn = $('#get-ten-btn');
		  var link = $('#ten_day-forecast');
		  view2.data = controller.getTheForecast();		
		  var days = view2.data.forecastday;
		  function fillForecast(index) {
			  var $title = $('<span></span>'),
				  $icon = $('<img />'),
				  $text = $('<p></p>'),
			      $div = $('<div class="days"></div>');
			  $title.text(index.title);
			  $icon.attr('src', index.icon_url);
			  $text.text( index.fcttext);
			  
			  var temp = $($title).append($icon).append($text);
			  $div.append(temp);
			  link.append($div);
		  }
			
		  days.forEach(fillForecast);
		  
		  view2.render();
		},
		
		render: function() {		  
		  this.getTenDaysBtn.on('click', function() {
			$('.days').fadeToggle();
			$('#current-conditions').children().slideToggle();
		  });
		}
	  };
	  
	  controller.init();
};
andrew(jQuery);
