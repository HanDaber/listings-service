var u = require('underscore');

function Listing( properties ) {
	// If we don't get a good properties object
	if( !properties || !((typeof properties) === 'object') ) {
		properties = {};
	}

	// Overwrite defaults with properties that were passed in
	var prop = u.defaults( properties, {
		'type': 'default',
		'name': '',
		'min': 1,
		'max': 100
	});

	// object properties
	this.type = properties.type;
	this.name = properties.name;
	this.min = properties.min;
	this.max = properties.max;
}
Listing.prototype = {
	// Scraper queries
	'cl_queries': function( base_urls ) {

		var self = this,
			temp = u.map( base_urls, url_string );

		function url_string( base ) {
			return encodeURI( base + 'search/sss?query=' + self.name + '&srchType=A' + '&minAsk=' + self.min + '&maxAsk=' + self.max );
		}

		return temp;
	}
};

module.exports = Listing;