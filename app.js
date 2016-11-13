/* This is the node app.js */

var express = require('express');
var path = require('path');
var passport = require('passport');
var configs = require('./modules/configs');
var session = require('express-session');
var compression = require('compression');
var bodyParser = require('body-parser');
var ejs = require('ejs');
require('./modules/auth')(configs, passport);

// Constants
var PORT = configs.get('app:http:port');

// App
var app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated())
     return next();
   else
     res.redirect('/login');
}

app.get('/login', function(req, res) {
  res.sendFile('views/login.html', {"root": __dirname});
});

var routes_consolidated = require('./routes/api.consolidated')(configs);
app.use('/api/consolidated/', isLoggedIn, routes_consolidated);

app.get('/', isLoggedIn, function (req, res) {
  res.redirect('/home');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
  })
);

app.get("/home", isLoggedIn, function (req, res) {
    console.log(req.session.passport);
    var curr_user = req.session.passport["user"];
    var curr_tenant = curr_user["tenant"]; 
    res.render('home.html', {
      tenant: curr_tenant
    });   
});

app.get("/logout", isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
