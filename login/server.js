// server.js

// set up===========================================
//get all the tools we need


var express		= require('express');
var app			= express();
var ip			= "0.0.0.0";
var port		= process.env.PORT || 5000;
var mongoose	= require('mongoose');
var passport 	= require('passport');
var flash		= require('connect-flash');

var morgan			= require('morgan');
var cookieParser	= require('cookie-parser');
var bodyParser		= require('body-parser');
var session			= require('express-session');

var configDB	= require('./config/database.js');


// configuration ====================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass the passport for configuration


//set up our express application
app.use(morgan('dev'));  // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); 	 // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templationg


// requires for passport
app.use(session({ secret: 'massamassamassamassamassamassa' })); // é segredo da sessão
app.use(passport.initialize());
app.use(passport.session()); // persistent login session
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ==========================================================
// quando eu faço um require é como se eu estivesse colando codigo 
// javascript aqui?

require('./app/routes.js')(app, passport); //load our routers and pass in our app and fully configured passport


// launch ===================================================
app.listen(port, ip);
console.log('A mágica acontece na porta: ' + port);