var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// ######## LISTING #######################################################
// Define listing properties
var listing_properties = {
  type: { type: String, default: 'listing' },
	name: { type: String, default: '' },
	min: { type: Number, default: 500 },
	max: { type: Number, default: 2500 }
}
// Define Listing schema
var listingSchema = new Schema( listing_properties );
// Define Listing Model from schema
var listingModel = mongoose.model( 'Listing', listingSchema );

module.exports = listingModel;