var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// ######## USER #######################################################
// Define User properties
var user_properties = {
	'name': { type: String },
	'email': { type: String, default: '' }
};

var user_methods = {
	'id': function () {
		return this._id;
	}
};

// Define User schema
var userSchema = new Schema( user_properties );

userSchema.methods = user_methods;

// Define User Model from schema
var userModel = mongoose.model( 'User', userSchema );

userModel.connection = mongoose.connection;

module.exports = userModel;
