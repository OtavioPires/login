// app/models/user.js
// load the things we need

var mongoose	= require('mongoose');
var bcrypt		= require('bcrypt-nodejs');

// define the shema for our user models
var userSchema = mongoose.Schema({
	local			: {
		email		: String,
		password	: String,
	}
});

//methods =================================
// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checar se a password é valida
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

//criar o modelo para usuarios e expor isso para nosso app
module.exports = mongoose.model('User', userSchema);