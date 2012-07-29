var _ = require('underscore');
var redis = require("redis");
var redisHost = '54.248.113.192';
var redisPort = '6379';
var position = require('./position.js');


module.exports = function(app, io, client1, client2, client3) {
  console.log('outside');


  chat = io.of('/chat')
  .on('connection', function(socket){
  	var myid = socket.handshake._id;
    var myconnection = redis.createClient(redisPort, redisHost);  //Comment out this line and change all other references to 'client1' to redis.createClient() to change to shared connection
  	console.log('The user ' + myid + 'has logged ON')

    socket.handshake.myconnection = myconnection;
   	/*myconnection.subscribe(myid, function(a, b){
   		console.log("SUBSCRIBING TO MY CONNECTION:::" + socket.handshake._id);
    });*/
   	// TODO - remove when live - the next two functions are for testing local chat between two brosers with fixed ids:
   	//id1: 353da530-203a-4fd2-9d58-732a2f4a4147
	//id2: e27537cd-c54d-4815-a40a-f3c49a3bf65d
   	myconnection.subscribe("353da530-203a-4fd2-9d58-732a2f4a4147", function(a, b){
   		console.log("SUBSCRIBING TO MY CONNECTION:::" + "353da530-203a-4fd2-9d58-732a2f4a4147");
    });
   	myconnection.subscribe("e27537cd-c54d-4815-a40a-f3c49a3bf65d", function(a, b){
   		console.log("SUBSCRIBING TO MY CONNECTION:::" + "e27537cd-c54d-4815-a40a-f3c49a3bf65d");
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
          // TODO take out the true clause, used for testing two browser chat
      if(true || channel === myid){
        socket.emit('chatMessage', message);
        console.log('EMITTING MESSAGE:::' + message + 'ON CHANNEL:::' + channel);
      }
      else{
      }
		});
		socket.on('location', function(data){
			console.log('outer location');
			registerLocation(myid, data, client3)
			socket.emit("locationInfo", "##");
		})
      socket.on('disconnect', function(socket){
        console.log('The user ' + myid + 'has logged OFF')
        myconnection.quit();
      });
  });

};

function registerLocation(myid, data, client3){
	console.log('Im registering myself now');
	console.log(myid);
	console.log(data);
	data = JSON.stringify(data);
	client3.set(myid, data, redis.print);
}