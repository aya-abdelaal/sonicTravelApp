var express = require("express");
const { connect } = require("http2");
var path = require("path");
var app = express();
var session = require('express-session');

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'secre-key',
  resave : false,
  saveUninitialized : false
}));

let msg = null;
let city = null;


 //get requests
{
  app.get("/", function (req, res) {
    res.render("login", {msg: msg});
    msg = null;
  });

  app.get("/registration", function (req, res) {
    res.render("registration", {msg : msg});
    msg = null;
  });

  app.get("/home", function (req, res) {
    if(req.session.username)
    res.render("home");
    else 
    res.redirect('/');
  });

  app.get("/cities", function (req, res) {
    if(req.session.username)
    res.render("cities");
    else 
    res.redirect('/');
  
  });

  app.get("/hiking", function (req, res) {
    if(req.session.username)
    res.render("hiking");
    else 
    res.redirect('/');
  });

  app.get("/islands", function (req, res) {
    if(req.session.username)
    res.render("islands");
    else 
    res.redirect('/');
  });

  app.get("/wanttogo", function (req, res) {
    if(req.session.username){
      userCollection.find({username: req.session.username}).toArray((err, doc) => {
        res.render('wanttogo', {places:doc[0].wantToGo});
      })
    }
    else 
    res.redirect('/');
  });

  app.get("/bali", function (req, res) {
    if(req.session.username){
    res.render("bali", {video : "https://www.youtube.com/embed/LCqK7wZd2Pk", msg: msg});
    city = "bali";
    msg = null;
    }
    else 
    res.redirect('/');

  });

  app.get("/inca", function (req, res) {
    if(req.session.username){
    res.render("inca", {video :  "https://www.youtube.com/embed/cnMa-Sm9H4k", msg: msg});
    msg = null;
    city = "inca";
    }
    else 
    res.redirect('/');
  });

  app.get("/annapurna", function (req, res) {
   
    if(req.session.username){
    res.render("annapurna", {video : "https://www.youtube.com/embed/nIzcnoyhzSQ", msg : msg});
    msg = null;
    city = "annapurna";
    }
    else 
    res.redirect('/');
  });

  app.get("/paris", function (req, res) {
    if(req.session.username){
    res.render("paris", {video : "https://www.youtube.com/embed/UfEiKK-iX70", msg: msg});
    msg = null;
    city = "paris";
    }
    else 
    res.redirect('/');
    
  });

  app.get("/rome", function (req, res) {
    if(req.session.username){
    res.render("rome", {video : "https://www.youtube.com/embed/oSexfR0Ubzw", msg:msg});
    msg = null;
    city = "rome";
    }
    else 
    res.redirect('/');
  });

  app.get("/santorini", function (req, res) {
    if(req.session.username){
    res.render("santorini", {video:"https://www.youtube.com/embed/cKedc8trR2Y", msg:msg});
    msg = null;
    city = "santorini";
    }
    else 
    res.redirect('/');
    
  });

  app.get("/searchresults", function (req, res) {
    if(req.session.username)
    res.render("searchresults");
    else 
    res.redirect('/');
    
  });
}

//DB constants
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://127.0.0.1:27017/sonicDB";
const dbName = "sonicDB";
const collectionName = "Users";
let db = null;
let userCollection = null;

//Conncecting to database
MongoClient.connect(uri,(err,client) => {
  if (err) return console.log(err);
  db = client.db(dbName);
  console.log('Yay!Connected!');
  userCollection = db.collection(collectionName);
})


//inserting user
{
function insertUser(username, password){
    var user ={
        username: username,
        password: password,
        wantToGo: []
    }
    userCollection.insertOne(user, (err,res) => {
      if (err) return console.log(err);
      console.log(res);
    })
}

app.post("/register", (req, res) => {
  if (req.body.username != "" && req.body.password != "") {
    userCollection.find({username: req.body.username}).toArray((err, doc) => {
      if(err || doc.length != 0){  
        msg = "Username already exists";
        res.redirect('/registration');}
      else {
        insertUser(req.body.username, req.body.password);
    msg = "Successfully registered";
  res.redirect('/');
      }
    })
  }
  else {
    msg = "Username and password can't be empty";
    res.redirect('/');
  }
});

}

//user login
{
app.post('/', (req, res) => {
  username = req.body.username;
  password = req.body.password;
  userCollection.find({username : username}).toArray( (err, users) => {
    console.log(users) ; 
    if(users.length > 0){
      if(users[0].password == password){
      req.session.username = username;
      res.redirect('/home');
      }
      else {
        msg = "wrong password"
        res.redirect("/");
      }
  }
  else {
      msg = "User not found";
      res.redirect("/");
  }

  });
});
}


//adding to wantogo
app.post('/addWantToGo', (req,res) => {
  userCollection.find({username : username}).toArray((err,users) => {
    if(users[0].wantToGo.includes(city))
    msg = "city already added";
    else {
      userCollection.updateOne({username : req.session.username}, {$addToSet : {"wantToGo" : city}});
  msg = "successfully added";
    }
    res.redirect("/" + city);
  })  
  console.log(city);
  
})



//search
function getAllSubstrings(s){
  let i,j,res = [];

  for(i = 0; i < s.length; i++){
    for(j = i+1; j<s.length+1; j++){
      res.push(s.slice(i,j));
    }
  }

  return res;
}

let subs = [{city:"bali", subs: getAllSubstrings("bali")},
{city:"rome", subs: getAllSubstrings("rome")},
{city:"annapurna", subs: getAllSubstrings("annapurna")},
{city:"inca", subs: getAllSubstrings("inca")},
{city:"paris", subs: getAllSubstrings("paris")},
{city:"santorini", subs: getAllSubstrings("santorini")}];



app.post('/search', async (req,res) => {
const x = req.body.Search;
let output = [];

subs.forEach(item =>  {
  if(item.subs.includes(x.toLowerCase()))
    output.push({title: item.city});
})

res.render('searchresults',{cities: output});
});




app.listen(3000);




