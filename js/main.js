var andrew = function(jQuery) {
	  var model = {
		init: function() {

		},
		the_data: {},
		the_forecast: {},
		the_threeDay: {},
		
		saveData: function(data) {
		  model.the_data = data.current_observation;
		},
		saveForecast: function(data) {
		  model.the_forecast = data.forecast.txt_forecast;
		  model.saveThreeDay();
		},
		saveThreeDay: function() {
		  model.the_threeDay = model.the_forecast.forecastday.slice(0, 6);
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
				view3.init();
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
		},
		getTheThreeDay: function() {
		  return model.the_threeDay;
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
		  view1.icon.attr('src', view1.data.icon_url);
		  view1.locationSpan.text(view1.data.display_location.full);
		  view1.currentTempSpan.text(view1.data.temperature_string);
		  view1.weatherSpan.text(view1.data.weather);
		  view1.windchillSpan.text('Windchill: ' + view1.data.windchill_string);
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
			      $div = $('<div class="days col-20"></div>');
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
			$('#ten_day-forecast .days').fadeToggle();
			$('#three_day-forecast .days').fadeOut();
			$('#current-conditions span, #current-conditions img').slideToggle();
		  });
		}
	  };
	  
	  // Three Day Forecast
	  var view3 = {
		init: function() {		  
		  this.getThreeDaysBtn = $('#get-three-btn');
		  var link = $('#three_day-forecast');
		  view3.data = controller.getTheThreeDay();		
		  var days = view3.data;
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
		  
		  view3.render();
		},
		
		render: function() {		  
		  this.getThreeDaysBtn.on('click', function() {
			$('#three_day-forecast .days').fadeToggle();
			$('#ten_day-forecast .days').fadeOut();
			$('#current-conditions span, #current-conditions img').slideToggle();
		  });
		}
	  };
	  
	  controller.init();
};
andrew(jQuery);
