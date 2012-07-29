var mylat;
var mylong;
var fieldInterval;

exports.myposition = function(req, res){
	
}

exports.registerPoint = function(req, res){
	mylat = req.lat;
	mylat = req.long;
	var newLat = Math.round(parseFloat(parseFloat(req.lat).toFixed(5)*10000));
	var newLong = Math.round(parseFloat(parseFloat(req.long).toFixed(5)*10000));
	var regPoint = newLat + '-' + newLong;
	client3.sadd(regPoint, req.session._id)
	setInterval(getField(), 10000);
}

exports.getField = function(){
	console.log('Getting Field for: ' + session._id);
	var set1 = client3.smembers(Math.ceil(mylat) + '-' + Math.ceil(mylong));
	var set2 = client3.smembers(Math.ceil(mylat) + '-' + Math.floor(mylong));
	var set3 = client3.smembers(Math.floor(mylat) + '-' + Math.ceil(mylong));
	var set4 = client3.smembers(Math.floor(mylat) + '-' + Math.floor(mylong));
	var fullset = set1.concat(set2, set3, set4);
}