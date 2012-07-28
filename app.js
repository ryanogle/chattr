express = require('express');
var app = express.createServer();
var BundleUp = require('bundle-up');

BundleUp(app, __dirname + '/public/assets.js', {
  staticRoot: __dirname + '/public/',
  staticUrlRoot: '/',
  bundle: false
});


app.use(express.static(__dirname + '/public/'))
app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(app.router);

app.set("views", __dirname + '/views');
app.set("view engine", "ejs");
app.set("view options", {layout: 'layouts/default.ejs'});
app.set('port', 3000);

// ROUTES
app.get('/', function(req, res){
  res.render('home');
});

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post('/signin', function(req, res){
  res.send(req.body.name);
});


app.listen(app.settings.port, function(){
  console.log("Express server listening on port %d.", app.settings.port);
});
