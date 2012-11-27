var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// ######## LISTING #######################################################
// Define listing properties
var listing_properties = {
  	'type': { type: String, default: 'for sale' },
	'name': { type: String, default: 'none' },
	'min': { type: Number, default: 0 },
	'max': { type: Number, default: 2500 }
};

var listing_methods = {
	// Scraper queries
	'cl_queries': function( base_urls ) {

		var self = this,
			temp = u.map( base_urls, url_string );

		function url_string( base ) {
			return encodeURI( base + 'search/' + self.category() + '?query=' + self.name + '&srchType=T' + '&minAsk=' + self.min + '&maxAsk=' + self.max );
		}

		return temp;
	},
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