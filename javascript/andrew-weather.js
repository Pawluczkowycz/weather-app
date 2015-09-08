var andrew = function(jQuery) {

	  /* ======= Model ======= */
	  var model = {
		
			init: function() {
			  this.forecast = {};
			  this.current = {};
			},
			addCurrent: function(cityState, data) {
			  this.current[cityState] = data;
			},
			addForecast: function(cityState, data) {
			  this.forecast[cityState] = data;
			}
	  };
	  
	  /* ======= Controller ======= */
	  var controller = {
		  
		   init: function() {
			 model.init();
			 view.init();
			 this.getGeoloc();
		   },
		   getGeoloc: function() {
			if(navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = position.coords.latitude,
					longitude = position.coords.longitude;

				$.ajax({
				  url: "https://api.wunderground.com/api/49ef740b3b58e7ce/conditions/q/" + latitude + "," + longitude + ".json",
				  dataType: 'jsonp'
				})
				.done(function(data) {
				  var cityState = data.current_observation.display_location.city;
				  model.addCurrent(cityState, data);
				  $("#currentConditions").show();
				  view.render(cityState);
				  controller.getGeoForecast(latitude + "," + longitude);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					showError(errorThrown);
				});
						
					})
				} else { return;};
		   },
		   getGeoForecast: function(latLog) {

			 $.ajax({
			  url: "https://api.wunderground.com/api/49ef740b3b58e7ce/forecast10day/q/" + latLog + ".json",
			  dataType: 'jsonp'
		    })
		    .done(function(data) {
			  var cityState = latLog;
			  model.addForecast(cityState, data);
			  view.render2(cityState);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});  
		   },
		   getCurrent: function() {
			
			var newCity,
				newState;
			
			this.newCity = document.getElementById('city');
			this.newState = document.getElementById('state');
			newCity = this.newCity.value;
			newState = this.newState.value;

			 $.ajax({
			  url: "https://api.wunderground.com/api/49ef740b3b58e7ce/conditions/q/" + newState + "/" + newCity + ".json",
			  dataType: 'jsonp'
		    })
		    .done(function(data) {
			  model.addCurrent(newCity + newState, data);
			  view.render(newCity + newState);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});  
		   },
		   getForecast: function() {
			
			var newCity,
				newState;
			
			this.newCity = document.getElementById('city');
			this.newState = document.getElementById('state');
			newCity = this.newCity.value;
			newState = this.newState.value;

			 $.ajax({
			  url: "https://api.wunderground.com/api/49ef740b3b58e7ce/forecast10day/q/" + newState + "/" + newCity + ".json",
			  dataType: 'jsonp'
		    })
		    .done(function(data) {
			  model.addForecast(newCity + newState, data);
			  view.render2(newCity + newState);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});  
		   },
		   render: function() {
			   
		   }
	  };
	  
	  /* ======= View ======= */
	  var view = {
			
			init: function() {
			  this.cityState = document.getElementById('city-state');
			  this.weather = $('.current #weather');
			  this.location = document.getElementById('location');
			  this.time = document.getElementById('time');
			  this.icon = document.getElementById('icon');
			  this.temp = document.getElementById('temp');
			  this.text = document.getElementById('fcttext');
			  this.extendedBtn = $('#extended-forecast-btn');
			  this.currentBtn = $('#current-conditions-btn');
			  
			  $('h3').hide();
    //$('#tenDayForecast').hide();
			  this.extendedBtn.hide();
			  this.currentBtn.hide();
			  $("#currentConditions").hide();
			  
			  this.cityState.addEventListener('click', function(e) {
          e.preventDefault();
          controller.getCurrent();
    //$("#tenDayForecast").hide();
          $("#currentConditions").show();
          controller.getForecast();
			  });
			  
			  this.currentBtn.on('click', function() {
				$("#currentConditions").show();  
			  })
			},
			
			render: function(cityState) {
			  // Current Conditions
			  view.location.textContent = model.current[cityState].current_observation.display_location.full;
			  view.time.textContent = model.current[cityState].current_observation.observation_time;
			  view.temp.textContent = model.current[cityState].current_observation.temperature_string;
			  view.icon.src = model.current[cityState].current_observation.icon_url;
			  $(view.weather).text(model.current[cityState].current_observation.weather);
			  			  
			  $('h3, #extended-forecast').show();
			  this.extendedBtn.show();
			},
			
			render2: function(cityState) {
			  
			  var temp = cityState;
			  this.extendedBtn = $('#extended-forecast-btn');
			  
			  $('#extended-forecast-btn').on('click', function() {
          $('#currentConditions').fadeOut();
          //$('#flipper').addClass( 'flipped' );
          $('#tenDayForecast').fadeIn();
          $(this).hide();
          $('#three-day-btn').show();
          view.render3(temp);
			  });
			  
			  // Current Condition
			  view.text.textContent = model.forecast[cityState].forecast.txt_forecast.forecastday[0].fcttext;
			   // Period-1
			  this.period1Icon = $('.period-1 #icon');
			  this.period1Title = $('.period-1 #title');
			  this.period1Text = $('.period-1 #fcttext');
			  
			  view.period1Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[1].icon_url);
			  view.period1Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[1].title);
			  view.period1Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[1].fcttext);
			  
			  // Period-2
			  this.period2Icon = $('.period-2 #icon');
			  this.period2Title = $('.period-2 #title');
			  this.period2Text = $('.period-2 #fcttext');
			  
			  view.period2Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[2].icon_url);
			  view.period2Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[2].title);
			  view.period2Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[2].fcttext);
			  
			  // Period-3
			  this.period3Icon = $('.period-3 #icon');
			  this.period3Title = $('.period-3 #title');
			  this.period3Text = $('.period-3 #fcttext');
			  
			  view.period3Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[3].icon_url);
			  view.period3Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[3].title);
			  view.period3Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[3].fcttext);
			  
			  // Period-4
			  this.period4Icon = $('.period-4 #icon');
			  this.period4Title = $('.period-4 #title');
			  this.period4Text = $('.period-4 #fcttext');
			  
			  view.period4Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[4].icon_url);
			  view.period4Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[4].title);
			  view.period4Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[4].fcttext);
			  
			  // Period-5
			  this.period5Icon = $('.period-5 #icon');
			  this.period5Title = $('.period-5 #title');
			  this.period5Text = $('.period-5 #fcttext');
			  
			  view.period5Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[5].icon_url);
			  view.period5Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[5].title);
			  view.period5Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[5].fcttext);
			},
			
			render3: function(cityState) {
				
			  $('#three-day-btn').show();
			  
			  $('#three-day-btn').on('click', function() {
    $('#tenDayForecast').fadeOut();
          //$('#flipper').removeClass( 'flipped' );
          $('#currentConditions').fadeIn();
          view.extendedBtn.show();
          $(this).hide();
			  });
			  
			   // Period-1
			  this.period1Icon = $('.period-1 #icon');
			  this.period1Title = $('.period-1 #title');
			  this.period1Text = $('.period-1 #fcttext');
			  
			  view.period1Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[1].icon_url);
			  view.period1Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[1].title);
			  view.period1Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[1].fcttext);
			  
			  // Period-2
			  this.period2Icon = $('.period-2 #icon');
			  this.period2Title = $('.period-2 #title');
			  this.period2Text = $('.period-2 #fcttext');
			  
			  view.period2Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[2].icon_url);
			  view.period2Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[2].title);
			  view.period2Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[2].fcttext);
			  
			  // Period-3
			  this.period3Icon = $('.period-3 #icon');
			  this.period3Title = $('.period-3 #title');
			  this.period3Text = $('.period-3 #fcttext');
			  
			  view.period3Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[3].icon_url);
			  view.period3Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[3].title);
			  view.period3Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[3].fcttext);
			  
			  // Period-4
			  this.period4Icon = $('.period-4 #icon');
			  this.period4Title = $('.period-4 #title');
			  this.period4Text = $('.period-4 #fcttext');
			  
			  view.period4Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[4].icon_url);
			  view.period4Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[4].title);
			  view.period4Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[4].fcttext);
			  
			  // Period-5
			  this.period5Icon = $('.period-5 #icon');
			  this.period5Title = $('.period-5 #title');
			  this.period5Text = $('.period-5 #fcttext');
			  
			  view.period5Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[5].icon_url);
			  view.period5Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[5].title);
			  view.period5Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[5].fcttext);
			  
			  // Period-6
			  this.period6Icon = $('.period-6 #icon');
			  this.period6Title = $('.period-6 #title');
			  this.period6Text = $('.period-6 #fcttext');
			  
			  view.period6Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[6].icon_url);
			  view.period6Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[6].title);
			  view.period6Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[6].fcttext);
			  
			  // Period-7
			  this.period7Icon = $('.period-7 #icon');
			  this.period7Title = $('.period-7 #title');
			  this.period7Text = $('.period-7 #fcttext');
			  
			  view.period7Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[7].icon_url);
			  view.period7Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[7].title);
			  view.period7Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[7].fcttext);
			  
			  // Period-8
			  this.period8Icon = $('.period-8 #icon');
			  this.period8Title = $('.period-8 #title');
			  this.period8Text = $('.period-8 #fcttext');
			  
			  view.period8Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[8].icon_url);
			  view.period8Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[8].title);
			  view.period8Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[8].fcttext);
			  
			  // Period-9
			  this.period9Icon = $('.period-9 #icon');
			  this.period9Title = $('.period-9 #title');
			  this.period9Text = $('.period-9 #fcttext');
			  
			  view.period9Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[9].icon_url);
			  view.period9Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[9].title);
			  view.period9Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[9].fcttext);
			  
			  // Period-10
			  this.period10Icon = $('.period-10 #icon');
			  this.period10Title = $('.period-10 #title');
			  this.period10Text = $('.period-10 #fcttext');
			  
			  view.period10Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[10].icon_url);
			  view.period10Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[10].title);
			  view.period10Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[10].fcttext);
			  
			  // Period-11
			  this.period11Icon = $('.period-11 #icon');
			  this.period11Title = $('.period-11 #title');
			  this.period11Text = $('.period-11 #fcttext');
			  
			  view.period11Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[11].icon_url);
			  view.period11Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[11].title);
			  view.period11Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[11].fcttext);
			  
			  // Period-12
			  this.period12Icon = $('.period-12 #icon');
			  this.period12Title = $('.period-12 #title');
			  this.period12Text = $('.period-12 #fcttext');
			  
			  view.period12Icon.attr('src', model.forecast[cityState].forecast.txt_forecast.forecastday[12].icon_url);
			  view.period12Title.text(model.forecast[cityState].forecast.txt_forecast.forecastday[12].title);
			  view.period12Text.text(model.forecast[cityState].forecast.txt_forecast.forecastday[12].fcttext);
			}
	  };
	  
	  controller.init();
};

andrew(jQuery);