var u = require('underscore');

function Listing( properties ) {
	// If we don't get a good properties object
	if( !properties || !((typeof properties) === 'object') ) {
		properties = {};
	}

	// Overwrite defaults with properties that were passed in
	var prop = u.defaults( properties, {
		'type': 'for sale',
		'name': '',
		'min': 0,
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
			return encodeURI( base + 'search/' + self.category() + '?query=' + self.name + '&srchType=T' + '&minAsk=' + self.min + '&maxAsk=' + self.max );
		}

		return temp;
	},
	'category': function() {
		if( this.type === 'housing' ) { return 'hhh'; }
		else { return 'sss'; }
	}
};

module.exports = Listing;