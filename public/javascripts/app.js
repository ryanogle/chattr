/*---------------------------
 * WEB SOCKETS
 ---------------------------*/

var socket = io.connect('http://localhost/chat');

/**
 * Send your location
 * format is {lat:string, long:string}
 */
function sendLocation(data) {
	socket.emit('location', data);
}

// update html when recieving confirmation from server with location info (# of people, # of convos)
socket.on('locationInfo', function(data) {
	console.log(["Good news, the server got our location update and responded: ", data]);
});


/*--------------------------------------
 * jquery ready dependent functions here
 --------------------------------------*/
$(document).bind('pageinit', function() {
	
	$('#chat-test').click(function() {
		console.log("this should emit a text_message over websockets...");
		socket.emit('text_message', "Hey you, this message is a fake!");
	});
// end document.bind("pageinit")
});

/* ---------------------
 * GEOLOCATION FUNCTIONS
 ---------------------*/

var geolocation = {};
geolocation.lat = "not set...";
geolocation.long = "not set...";
/**
 * Retrive current location
 * Sets geolocation's lat and long properties
 * Sends location over websockets
 */
geolocation.getLocation = function() {
	// ask browser for location
	navigator.geolocation.getCurrentPosition(success, fail);
	var that = this;
	function success(position) {
		console.log(["Your position: ", position]);

		that.lat = position.coords.latitude;
		that.long = position.coords.longitude;

		// send location over websocket
		sendLocation({
			lat : this.lat,
			lon : this.long
		});
	}

	function fail(error) {
		var displayTxt = "Dont know reason";
		switch(error.code) {
			case error.PERMISSION_DENIED:
				displayTxt = 'Permission denied';
				break;
			case error.POSITION_UNAVAILABLE:
				displayTxt = 'Position unavailable';
				break;
			case error.TIMEOUT:
				displayTxt = 'Position lookup timeout. Please try again later.';
				break;
			default:
				displayTxt = 'Unknown position';
		}
		alert("Sorry, cant get location.  Reason: " + displayTxt);
		console.log("Sorry, cant get location.  Reason: " + displayTxt);
	}

};
/**
 * Starts the navigator's watchPosition function
 * Sends location over websocket if a new location gets established
 */
geolocation.trackLocation = function() {
	var that = this;
	console.log("Tracking your position...");
	navigator.geolocation.watchPosition(success, fail, {
		enableHighAccuracy : true,
		maximumAge : 30000,
		timeout : 27000
	});
	function success(position) {
		// distance threshold (calculated in feet)
		var threshold = 40;
		var moveDistance = that.calcDistance(that.lat, that.long, position.coords.latitude, position.coords.longitude);

		// ignore changes under threshold, or way big (like due to acurracy change rather than actual move)
		if (moveDistance < threshold || moveDistance > 300) {
			console.log("Distance change ignored (" + moveDistance + "ft)")
			return;
		}

		console.log(["You moved!  Your new location is " + moveDistance + "ft away from your last.  Your NEW position: ", position]);

		that.lat = position.coords.latitude;
		that.long = position.coords.longitude;

		// send location over websocket
		sendLocation({
			lat : this.lat,
			lon : this.long
		});
	}

	function fail(error) {
		var displayTxt = "Dont know reason";
		switch(error.code) {
			case error.PERMISSION_DENIED:
				displayTxt = 'Permission denied';
				break;
			case error.POSITION_UNAVAILABLE:
				displayTxt = 'Position unavailable';
				break;
			case error.TIMEOUT:
				displayTxt = 'Position lookup timeout. Please try again later.';
				break;
			default:
				displayTxt = 'Unknown position';
		}
		alert("Sorry, we were unable to track your location.  You can probably ignore this.  Reason: " + displayTxt);
	}

};

/**
 * get distance in feet between two location readings
 * Thanks http://www.geodatasource.com/developers/javascript for code
 */
geolocation.calcDistance = function(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var radlon1 = Math.PI * lon1 / 180;
	var radlon2 = Math.PI * lon2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515 * 5280;
	return dist;
}

geolocation.getLocation();
geolocation.trackLocation();

