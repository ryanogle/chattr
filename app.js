express = require('express');
var app = express.createServer();
var BundleUp = require('bundle-up');
var parseCookie = require('express/node_modules/connect').utils.parseCookie;
var redis = require("redis");
var sio = require('socket.io');
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore({host: 'ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com', port: '6379'});

BundleUp(app, __dirname + '/public/assets.js', {
  staticRoot: __dirname + '/public/',
  staticUrlRoot: '/',
  bundle: false
});

app.use(express.static(__dirname + '/public/'))
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ store: sessionStore, secret: 'chatter' }) );

//app.use(express.session({ store: new RedisStore({host: 'ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com', port: '6379'}), secret: 'chatter' }));

app.use(app.router);

app.set("views", __dirname + '/views');
app.set("view engine", "ejs");
app.set("view options", {layout: 'layouts/default.ejs'});
app.set('port', 3000);

//Require Controllers
var position = require('./controllers/position.js');
var signin = require('./controllers/signin.js');
var chat = require('./controllers/chat.js');

// RENDER ROUTES
app.get('/', authBounce, function(req, res){
  res.send('home');
});
app.get('/home', authBounce, function(req, res){
  res.render('home');
});
app.get('/mock', authBounce, function(req, res){
  res.render('home');
});
app.get('/signin', function(req, res){
  res.render('signin');
});


//DATA ROUTES
app.post('/position', position.myposition);
app.post('/signin', signin.signin);

function authBounce(req, res, next) {
  if (!req.session._id) {
    res.redirect("/signin");
  } else {
    next();
  }
}

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post('/signin', function(req, res){
  res.send(req.body.name);
});

var io = sio.listen(app);
io.set('authorization', function(data, next) {
    //pull express cookie, load
    //and validate user/session
    if (data.headers && data.headers.cookie) {
        var cookies = parseCookie(data.headers.cookie);
        var sid = cookies['connect.sid'];
        sessionStore.get(sid, function(e, sess) {
        	//console.log(sess);
            if (sess._id) {
                data.user = sess._id;
                data.session = sess;
                next(null, true);
            } else {
                next("Not a valid session", false);
            }
        });
    } else {
        next("No session cookie.", false);
    }
});

var client1 = redis.createClient("6379", "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com");
var client2 = redis.createClient("6379", "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com");
var client3 = redis.createClient("6379", "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com");

//chat(app, io, client1, client2, client3);

app.listen(app.settings.port, function(){
  console.log("Express server listening on port %d.", app.settings.port);
});
