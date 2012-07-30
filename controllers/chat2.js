var _ = require('underscore');
var redis = require("redis");
var Config = require('../lib/configure.js');
conf = new Config;

var redisHost = conf.redisHost;
var redisPort = '6379';
var position = require('./position.js');


module.exports = function(app, io, client1, client2, client3) {
  console.log('outside');


  chat = io.of('/chat')
  .on('connection', function(socket){
  	var ListeningPointsOrig;
  	var ListeningPointsNew;
  	var MyRegPoint;
  	var myid = socket.handshake._id;
    var myconnection = redis.createClient(redisPort, redisHost);  //Comment out this line and change all other references to 'client1' to redis.createClient() to change to shared connection
  	console.log('The user ' + myid + 'has logged ON')

    socket.handshake.myconnection = myconnection;

 		myconnection.subscribe(myid, function(){
   		console.log("SUBSCRIBING TO MY CONNECTION:::" + socket.handshake._id);
    });

    socket.on('chatMessage', function(data){
      //var chatChannel = data.chatChannel;
      //var msg = data.message;
      data = JSON.stringify(data);
      client2.publish(myid, data);
      console.log('PUBLISHED TO::: ' + myid);
        });
    	myconnection.on("message", function (channel, message){
          var typecheck = JSON.parse(message);
      if(typecheck.type === 'chatMessage'){
        socket.emit('chatMessage', message);
        console.log('EMITTING MESSAGE:::' + message + 'ON CHANNEL:::' + channel);
      } else if (typecheck.type === 'newMember') {
      	myconnection.subscribe(typecheck.id, function(){
      		console.log('Got New Member: ' + typecheck.id);
      	});
      } else if (typecheck.type === 'oldMember'){
      	myconnection.unsubscribe(typecheck.id, function(){
      		console.log('Removed Member: ' + typecheck.id);
      	});
      } else {
      	console.log('Received a message, but do not know the type, and did NOTHING with it');
      }
		});
		socket.on('location', function(data){
			console.log('Registering Point');
			position.registerPoint(data, function(regPoint){
				var regdata = {"id": myid, "type": "newMember"}
				regdata = JSON.stringify(regdata);
				client2.publish(regPoint, regdata);
				console.log(regPoint);
			});
			position.getField(myconnection, function(points){
				ListeningPointsNew = points;;

				if (ListeningPointsOrig){
					for(i=0; i<points.ListeningPointsOrig; i++){
						myconnection.unsubscribe(ListeningPointsOrig[i]);
						console.log('unsubscribing from the point: ' + ListeningPointsOrig[i]);
					}
				}

							
				for(i=0; i<points.length; i++){
					myconnection.subscribe(ListeningPointsNew[i], function(){
					console.log('subscribing to new points');
					});
				}
				ListeningPointsOrig = ListeningPointsOrig;
		})
      socket.on('disconnect', function(socket){
        console.log('The user ' + myid + 'has logged OFF')
        myconnection.quit();
      });
  });
});

}

