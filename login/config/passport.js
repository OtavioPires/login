// config/passport.js

//load all the things we need
var LocalStrategy	= require('passport-local').Strategy;

//load up the user model
var User 			= require('../app/models/user');


// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
    	done(null, user.id);
    });

    //usado para deserializar o usuario
    passport.deserializeUser(function(id, done) {
    	User.findById(id, function(err, user) {
    		done(err, user);
    	});
    });


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'


    passport.use('local-signup', new LocalStrategy({
    	// por default. a strategia local user username e password
    	usernameField : 'email',
    	passwordField : 'password',
    	passReqToCallback : true //allows us to pass the entire request to the callback

    },
    function(req, email, password, done) {

    	// asnchronous
    	// User.findOne wont fire unless data is sent back
    	process.nextTick(function() {

    		// find a user whose email is the same as the forms email
    		// we are checking to see if the user trying to login already exists
    		User.findOne({ 'local.email' : email }, function(err, user) {
    			// if there are any errors, return the error
    			if (err)
    				return done(err);

    			// check to see if theres already a user with that email
    			if (user) {
    				return done(null, false, req.flash('signupMessage', 'That email is alread taken.'));
    			} else {
    				// if there is no user with that emal
    				// create the user
    				var newUser = new User();
    				//set the user's local credentials
    				newUser.local.email = email;
    				newUser.local.password = newUser.generateHash(password);

    				//save the user
    				newUser.save(function(err) {
    					if (err)
    						throw err;
    					return done(null, newUser);
    				});
    			}
    		});
    	});
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================


    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        //por default, a estratégia local use username e password, vamos sobreescrever com email
        usernameField : 'email',
        password : 'password',
        passReqToCallback : true // permite-nos retornar o request inteiro para o callback
    

    },
    function(req, email, password, done) { // callback with email and password from our form
        
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login alread exists
        User.findOne({ 'local.email' : email }, function(err, user){
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); //req.flash is the wa to set flashdata using connect-flash


            // if the user is found but the password is wrong
            if(!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));


            // all is well, return sucessful user
            return done(null, user);
        });


    }));

};


