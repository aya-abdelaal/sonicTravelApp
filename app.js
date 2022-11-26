var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  res.render('login')
});

app.post('/', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password);
});

app.get('/registration', function(req,res){
    res.render('registration');
});

app.post('/register', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
});

app.get('/home', function(req,res){
  res.render('home');
});

app.get('/cities', function(req,res){
  res.render('cities');
});

app.get('/hiking', function(req,res){
  res.render('hiking');
});

app.get('/islands', function(req,res){
  res.render('islands');
});

app.get('/wanttogo', function(req,res){
  res.render('wanttogo');
});

app.get('/bali',function(req,res){
  res.render('bali');
});

app.get('/inca',function(req,res){
  res.render('inca');
});

app.get('/annapurna',function(req,res){
  res.render('annapurna');
});

app.get('/paris',function(req,res){
  res.render('paris');
});

app.get('/rome',function(req,res){
  res.render('rome');
});

app.get('/santorini',function(req,res){
  res.render('santorini');
});

app.get('/searchresults',function(req,res){
  res.render('searchresults');
});



app.listen(3000);


//added get requests le kolo to access pages
//added post requests for usernames and passwords
//need to embed vids
//do kol haga database
// and addd action buttons