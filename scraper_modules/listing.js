var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Result = require('./result').schema;

// ######## LISTING #######################################################
// Define listing properties
var listing_properties = {
  	'type': { type: String, default: 'for sale' },
	'name': { type: String, default: 'none' },
	'min': { type: Number, default: 0 },
	'max': { type: Number, default: 2500 },
	'last_scraped' : { type: Date, default: Date.now() },
	'cities' : [ String ],
	'results' : [ String ]
};

var listing_methods = {

	'category': function() {
		if( this.type === 'housing' ) { return 'hhh'; }
		else { return 'sss'; }
	}

};

// Define Listing schema
var listingSchema = new Schema( listing_properties );

listingSchema.methods = listing_methods;

// Define Listing Model from schema
var listingModel = mongoose.model( 'Listing', listingSchema );

module.exports = listingModel;

// if( process.argv[2] == '--run' ) {
// 	var l = new listingModel({'name' : '2001 honda civic'});

// 	l.scrape();
// }


