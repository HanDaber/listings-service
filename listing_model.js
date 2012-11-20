var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// ######## LISTING #######################################################
// Define listing properties
var listing_properties = {
  	'type': { type: String, default: 'for sale' },
	'name': { type: String, default: 'none' },
	'min': { type: Number, default: 0 },
	'max': { type: Number, default: 2500 }
}
// Define Listing schema
var listingSchema = new Schema( listing_properties );
// Define Listing Model from schema
var listingModel = mongoose.model( 'Listing', listingSchema );

module.exports = listingModel;