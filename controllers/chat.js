var _ = require('underscore');
var redis = require("redis");


module.exports = function(app, io, client1, client2, client3) {
  console.log('outside');


  chat = io.of('/chat')
  .on('connection', function(socket){
  	var myid = socket.handshake._id;
    var myconnection = redis.createClient("6379", "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com");  //Comment out this line and change all other references to 'client1' to redis.createClient() to change to shared connection
  	console.log('The user ' + myid + 'has logged ON')

    socket.handshake.myconnection = myconnection;
   	myconnection.subscribe(myid, function(a, b){
   		console.log("SUBSCRIBING TO MY CONNECTION:::" + socket.handshake._id);
    });

    socket.on('text_message', function(data){
      //var chatChannel = data.chatChannel;
      //var msg = data.message;
      data = JSON.stringify(data);
      client2.publish(myid, data);
      console.log('PUBLISHED TO::: ' + myid);
        });
    	myconnection.on("message", function (channel, message){
          var typecheck = JSON.parse(message);
      if(channel === myid){
      	message = 'Echoing back: ' + message;
        socket.emit('chat', message);
        console.log('EMITTING MESSAGE:::' + message + 'ON CHANNEL:::' + channel);
      }
      else{
      }
		});
		socket.on('location', function(data){
			registerLocation(myid, data, client3)
		})
      socket.on('disconnect', function(socket){
        console.log('The user ' + myid + 'has logged OFF')
        myconnection.quit();
      });
  });

};

function registerLocation(myid, data, client3){
	console.log('Im registering myself now');
	client3.set(myid, data, redis.print);
}