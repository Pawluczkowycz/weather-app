
/* ======= Model ======= */

var model = {
	
	  localWeather: null,
	  savedForecasts: {},
	  savedCurrentConditions: {}
	  
};

/* ======= Controller ======= */

var controller = {
	  
	  init: function() {
		
		this.getLocalWeather();
		//this.getCurrentConditions();
		currentView.init();
		savedView.init();
	  },
	  
	  getLocalWeather: function() {
		 
	  },
	  
	  addCurrentConditions: function( name, data ) {
		model.savedCurrentConditions[name] = data;
		savedView.update(model.savedCurrentConditions[name]);		
	  },
	  
	  getCurrentConditions: function() {
		var newCity,
			newState,
			newLocation;
		
		this.newCity = document.getElementById('city');
		this.newState = document.getElementById('state');
		newCity = this.newCity.value;
		newState = this.newState.value;
		console.log(newCity + ' ' + newState);
		
		$.ajax({
			  url: "http://api.wunderground.com/api/49ef740b3b58e7ce/conditions/q/" + newState + "/" + newCity + ".json",
			  dataType: 'jsonp'
		    })
		    .done( function(data) {
				controller.addCurrentConditions( newCity + newState, data );
				
				if (data.current_observation === undefined) {
					alert( newCity + " and " + newState + " Unavailable!");
					delete model.savedCurrentConditions[newCity + newState];
				} else {
				   currentView.render(model.savedCurrentConditions[newCity + newState]);
				}
			} )
			.fail( function(jqXHR, textStatus, errorThrown) {
				showError(errorThrown);
			});
			
	  },
	  	  
	  addForecast: function( name, data ) {
		model.savedForecasts[name] = data;
	  },
	  
	  getSavedForecast: function( name ) {
		return model.savedForecasts[name];
	  }
};

/* ======= Current View ======= */

var currentView = {
	  
	  init: function() {
		// DOM elements
		this.cityStateBtn = document.getElementById('city-state-btn');
		this.cityState = document.getElementById('current-city-state');
		this.icon = document.getElementById('current-icon');
		this.temperature = document.getElementById('current-temperature');
		this.conditions = document.getElementById('current-conditions');
		this.wind = document.getElementById('current-wind');
		this.humidity = document.getElementById('current-humidity');
		
		// on click, get new reading
		this.cityStateBtn.addEventListener('click', function() {
		  controller.getCurrentConditions();
		});		
	  },
	  
	  render: function( x ) {
				
		var weather = x;
		    weather = weather.current_observation;
		
		this.cityState.textContent = weather.display_location.full;
		this.icon.src = weather.icon_url;
		this.temperature.textContent = weather.temperature_string;
		this.conditions.textContent = weather.weather;
		this.wind.textContent = weather.wind_string;
		this.humidity.textContent = weather.relative_humidity;

	  }
};

var savedView = {
	
	  init: function() {
		this.placeObj = {};
	  },
	  
	  update: function(place) {
		
		var $local = place.current_observation.display_location.full,
			$place = place,
		    $title = $('<a href="#" data-city=' + $place + '>' + $local + '</a>'),
			$div = $('<div></div>'),
			$saved = $('#saved-locations');
		
		this.placeObj[$local] = $place;
			
		$div.append($title);
		$saved.append($div);

		$title.on('click', function() {
		  currentView.render(savedView.placeObj[$local]);
		});
	  }
};

controller.init();