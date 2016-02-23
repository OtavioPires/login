// app/routes.js

module.exports = function(app, passport) {

	// =============================================
	//	HOME PAGE (com links de login) =============
	// =================================	============

	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.js file
	});

	// =============================================
	//	LOGIN ======================================
	// =============================================
	// mostra o form de login

	app.get('/login', function(req, res) {
		
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	// processa o form de login
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



	// ==============================================
	// SIGNUP =======================================
	// ==============================================
	// mostra o form de login


	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data (nao sei o que é isso)
		// aqui ele tá trabalhando com render ao inves de criar uma pasta publica
		// acho q porque nao usamos angular
		res.render('signup.ejs', {message: req.flash('signupMessage') });

	});

	// processa o form de signup
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// ==============================================
	// PROFILE SECTION ==============================
	// ==============================================
	// essa parte vai ser protegida, para que somente logados 
	// visitem, uso do route middleware: função isLoggedIn 

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// ==============================================
	// LOGOUT =======================================
	// ==============================================

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};


function isLoggedIn(req, res, next) {

	// se o usuario esta autenticado na sessão, siga em frente
	if (req.isAuthenticated())
		return next();

	// se ele nao esta redirecione para a home page
	res.redirect('/');
}