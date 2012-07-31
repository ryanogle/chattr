var mylat;
var mylong;
var fieldInterval;
var fieldAccuracy = 2;
var fieldMultiplier = Math.pow(10, fieldAccuracy);
console.log('field multi: ' + fieldMultiplier)

exports.myposition = function(req, res){
	
}

exports.registerPoint = function(data, cb){
	mylat = data.lat;
	mylong = data.long;
	console.log('my latitude is: ' + mylat);
	console.log('my longitude is: ' + mylong);
	var newLat = Math.round(parseFloat(parseFloat(data.lat).toFixed(3)*100));
	var newLong = Math.round(parseFloat(parseFloat(data.long).toFixed(3)*100));
	console.log('my new lat is: ' + newLat)
	console.log('my new long is: ' + newLong)
	var regPoint = newLat + '-' + newLong;
	console.log('Registering my id:' + session._id +  'at point: ' + newLat + '-' + newLong)
	client3.sadd(regPoint, session._id)
	cb(regPoint);
}

exports.getField = function(myconnection, cb){
	var fullset = [];
	var points = []
	console.log('Getting Field for: ' + session._id);
	console.log('my latitude is: ' + mylat);
	console.log('my longitude is: ' + mylong);
	var point1 = Math.ceil(mylat*fieldMultiplier) + '-' + Math.ceil(mylong*fieldMultiplier);
	points.push(point1);
	var point2 = Math.ceil(mylat*fieldMultiplier) + '-' + Math.floor(mylong*fieldMultiplier);
	points.push(point2);
	var point3 = Math.floor(mylat*fieldMultiplier) + '-' + Math.ceil(mylong*fieldMultiplier);
	points.push(point3);
	var point4 = Math.floor(mylat*fieldMultiplier) + '-' + Math.floor(mylong*fieldMultiplier);
	points.push(point4);
	
	console.log(point1);
	console.log(point2);
	console.log(point3);
	console.log(point4);

	client3.smembers(point1, function(err, results){
		console.log('results1: ' + results);
		for (var key in results) {
  		myconnection.subscribe(results[key], function(){
				console.log('subscribing to:' + results[key]);
			});
  	}
	});
	client3.smembers(point2, function(err, results){
		console.log('results2: ' + results);
		for (var key in results) {
  		myconnection.subscribe(results[key], function(){
				console.log('subscribing to:' + results[key]);
			});
  	}
	});
	client3.smembers(point3, function(err, results){
		console.log('results3: ' + results);
		for (var key in results) {
  		myconnection.subscribe(results[key], function(){
				console.log('subscribing to:' + results[key]);
			});
  	}
	});
	client3.smembers(point4, function(err, results){
		console.log('results4: ' + results);
		for (var key in results) {
  		myconnection.subscribe(results[key], function(){
				console.log('subscribing to:' + results[key]);
			});
  	}
	});
	console.log(fullset);
	cb(points);
	myconnection.unsubscribe('somechannel', function(){
	console.log('bleh');
	});
	//var fullset = set1.concat(set2, set3, set4);
}