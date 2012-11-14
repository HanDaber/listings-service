var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// ######## CITY #######################################################

// Define City schema
var citySchema = new Schema({
	name: { type: String, default: '' }
});
// Define Model from schema
var cityModel = mongoose.model( 'City', citySchema );

module.exports = cityModel;