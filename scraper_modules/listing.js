var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	a_month_ago = require('./scraper_helper').a_month_ago;
	// Result = require('./result').schema;

// ######## LISTING #######################################################
// Define listing properties
var listing_properties = {
  	'type' : { type: String, default: 'sss' },
	'name' : { type: String, default: 'none' },
	'min' : { type: Number, default: 0 },
	'max' : { type: Number, default: 2500 },
	'last_scraped' : { type: String, default: a_month_ago() },
	'cities' : [ String ],
	'results' : [],
	'user_id' : String
};

var listing_methods = {

	'category': function() {
		return this.type;
	}

};

// Define Listing schema
var listingSchema = new Schema( listing_properties );

listingSchema.methods = listing_methods;

// Define Listing Model from schema
var listingModel = mongoose.model( 'Listing', listingSchema );

// listingModel.connection = mongoose.connection;

module.exports = listingModel;

// if( process.argv[2] == '--run' ) {
// 	var l = new listingModel({'name' : '2001 honda civic'});

// 	l.scrape();
// }


