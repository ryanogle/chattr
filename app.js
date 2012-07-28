express = require('express');
var app = express.createServer();
var BundleUp = require('bundle-up');

var redis = require("redis");
//var client = redis.createClient();
//var RedisStore = require('connect-redis')(express);
var RedisStore = function RedisStore(options) {
    options = options || {"port": "6379", "host": "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com"};
    this.client = new redis.createClient(options.port, options.host, options);
};
RedisStore();

var client1 = redis.createClient("6379", "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com");

BundleUp(app, __dirname + '/public/assets.js', {
  staticRoot: __dirname + '/public/',
  staticUrlRoot: '/',
  bundle: false
});


app.use(express.static(__dirname + '/public/'))
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(express.session({secret: "chatter", store: RedisStore}));

app.use(app.router);

app.set("views", __dirname + '/views');
app.set("view engine", "ejs");
app.set("view options", {layout: 'layouts/default.ejs'});
app.set('port', 3000);

//Require Controllers
var position = require('./controllers/position.js');
var signing = require('./controllers/signin.js');

// RENDER ROUTES
app.get('/', function(req, res){
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
app.post('/position', authBounce, position.myposition);
app.post('/signin', authBounce, signing.signin);

function authBounce(req, res, next) {
  if (!req.session.user) {
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


app.listen(app.settings.port, function(){
  console.log("Express server listening on port %d.", app.settings.port);
});
