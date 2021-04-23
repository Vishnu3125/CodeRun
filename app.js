require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const fs = require("fs");
app.use(express.json());
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const cmd = require('node-cmd');
const jq = require('jquery');

app.use(express.urlencoded({extended:false}));

app.use(session({
  secret: "this is little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//________________data-base connection-----------------
mongoose.connect("mongodb+srv://Riya_06:Riy@6175@atlas@cluster0.mnab0.mongodb.net/userDetails?retryWrites=true/userDetails", {useNewUrlParser:true,
useUnifiedTopology: true,
useCreateIndex:true
});
mongoose.set("useCreateIndex",true);
//--------------registeration user scehma------------------
const userSchema = new mongoose.Schema({
  username: {
      type: String,
      //required: true
  },
  Email: {
      type: String,
      //required: true,
      unique: true
  },
  password:{
      type: String,
      //required: true
  }
});
userSchema.plugin(passportLocalMongoose);
//------------------model---------------------------------------
const User = new mongoose.model("User",userSchema);

//module.exports = User;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const port = process.env.PORT || 3000;

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.get('/', function(req, res) {
    res.render('index');
    });

app.get('/home', function(req, res) {
  res.render('home');
  });

  app.get('/about', function(req, res) {
    res.render('about');
    });

  app.get('/introduction', function(req,res){
    res.render('introduction');
  });

  app.get('/overview', function(req,res){
    res.render('overview');
  });

  app.get('/introduction', function(req,res){
    res.render('introduction');
  });
  app.get('/basic-syntax', function(req,res){
    res.render('basic-syntax');
  });
  app.get('/variable-type', function(req,res){
    res.render('variable-type');
  });
  app.get('/basic-operator', function(req,res){
    res.render('basic-operator');
  });


  app.get('/environment-setup', function(req,res){
    res.render('environment-setup');
  });

  app.get('/output',function(req,res){
    res.render('output');
  });

  app.get('/functions',function(req,res){
    res.render('functions');
  });

  app.get('/decision-making',function(req,res){
    res.render('decision-making');
  });

  app.get('/loops',function(req,res){
    res.render('loops');
  });

  app.get('/numbers',function(req,res){
    res.render('numbers');
  });

  app.get('/strings',function(req,res){
    res.render('strings');
  });

  app.get('/lists',function(req,res){
    res.render('lists');
  });

  app.get('/tuples',function(req,res){
    res.render('tuples');
  });

  app.get('/dictionary',function(req,res){
    res.render('dictionary');
  });

  app.get('/date-time',function(req,res){
    res.render('date-time');
  });

  app.get('/functions',function(req,res){
    res.render('functions');
  });

  app.get('/modules',function(req,res){
    res.render('modules');
  });

  app.get('/fileio',function(req,res){
    res.render('fileio');
  });

  app.get('/exceptions',function(req,res){
    res.render('exceptions');
  });

  app.get('/class-objects',function(req,res){
    res.render('class-objects');
  });
  
  app.get('/login-signup',function(req,res){
    res.render('login-signup');
  });


  app.get("/editor",function(req,res){
    if(req.isAuthenticated()){
      res.render("editor");
    }else{
      res.redirect("/login-signup");
    }
  });

  app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  });
//-----------------post - request for login-signup-------------------------------------------
  app.post("/login", function(req,res){
    const user = new User({
      username: req.body.username,
      Password: req.body.password
    });
    
    req.login(user, function(err){
      if(err){
        console.log(err);
      }
      else{
        passport.authenticate("local")(req, res, function(){
          res.redirect("/editor");
        });
      }
    });
  });

  
  app.post("/signup", function(req,res){
    User.register({username: req.body.username,Email:req.body.Email},req.body.password, function(err,user){
      if(err){
        console.log(err);
        res.redirect("/login-signup");
      }else{
        passport.authenticate("local")(req, res, function(){
          res.redirect("/editor");
        });
      }
    });
  });

  
//--------------Editor related code---------------
//--------------do not touch this part------------

var data_output = "";
app.post('/output', function(req,res){
  var data_input = req.body.editor;

  fs.writeFile('code.py', data_input, function(err) {
      if (err) {
          return console.error(err);
      }
  });
  
  cmd.runSync('python code.py');
  cmd.run('python code.py',
  function(err, data, stderr, res){
    if(stderr)
    {
      data_output = stderr;
    }
    else{
      data_output = data;
    }
    
  });
  // res.send(data_output);
  // setTimeout(() => {  res.send(data_output); }, 2000);
});

app.get('/button_api', function(req, res) {
  exports.getTeamData = function () {
};
res.send(data_output);
});
  
//--------------------listning to server(do not touch)------------------------------
app.listen(port, function(){
  console.log(`server running on port ${port}`);
});
