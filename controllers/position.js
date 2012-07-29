var mylat;
var mylong;
var fieldInterval;

exports.myposition = function(req, res){
	
}

exports.registerPoint = function(data, cb){
	mylat = data.lat;
	mylong = data.long;
	console.log('my latitude is: ' + mylat);
	console.log('my longitude is: ' + mylong);
	var newLat = Math.round(parseFloat(parseFloat(data.lat).toFixed(5)*10000));
	var newLong = Math.round(parseFloat(parseFloat(data.long).toFixed(5)*10000));
	console.log('my new lat is: ' + newLat)
	console.log('my new long is: ' + newLong)
	var regPoint = newLat + '-' + newLong;
	console.log('Registering my id:' + session._id +  'at point: ' + newLat + '-' + newLong)
	client3.sadd(regPoint, session._id)
	cb(regPoint);
}

exports.getField = function(cb){
	var fullset = [];
	var points = []
	console.log('Getting Field for: ' + session._id);
	console.log('my latitude is: ' + mylat);
	console.log('my longitude is: ' + mylong);
	var point1 = Math.ceil(mylat*10000) + '-' + Math.ceil(mylong*10000);
	points.push(point1);
	var point2 = Math.ceil(mylat*10000) + '-' + Math.floor(mylong*10000);
	points.push(point2);
	var point3 = Math.floor(mylat*10000) + '-' + Math.ceil(mylong*10000);
	points.push(point3);
	var point4 = Math.floor(mylat*10000) + '-' + Math.floor(mylong*10000);
	points.push(point4);
	
	console.log(point1);
	console.log(point2);
	console.log(point3);
	console.log(point4);

	client3.smembers(point1, function(err, results){
		fullset.concat(results);
		console.log('results1: ' + results);
	});
	client3.smembers(point2, function(err, results){
		fullset.concat(results);
		console.log('results2: ' + results);
	for (var key in results) {
   console.log('key: ' + results[key]);
  }
	});
	client3.smembers(point3, function(err, results){
		fullset.concat(results);
		console.log('results3: ' + results);
	});
	client3.smembers(point4, function(err, results){
		//fullset.concat(results);
		console.log('results4: ' + results);

		
		
	});
	console.log(fullset);
	cb(points);
	//var fullset = set1.concat(set2, set3, set4);
}