// Require modules
var scrape = require('scraper');


function Scraper ( url_array ) {

	this.urls = url_array;
}
Scraper.prototype = {
	'scrape': function ( callback ) {
		
		var self = this;

		scrape( self.urls, callback, { 'reqPerSec': (self.urls.length / 2) });
	},

	'get_all_cities': function ( state, callback ) {

		var str = 'http://geo.craigslist.org/iso/us/' + state;

		scrape( str, callback );
	}
};

module.exports = Scraper;

/*



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




function Fetcher( resource ) {

	this.resource = resource;
	this.list = [];
}
Fetcher.prototype = {

	'fetch': function(cb) {
		
		var self = this;

		return function(cb) {
			request('http://localhost:3000/api/'+self.resource, cb);
		};
	},

	'extract': function(body) {
		this.list = u.map(JSON.parse(body), function(e) { return e.name; });
	}
};




function get_all_cities( state ) {

	var str = 'http://geo.craigslist.org/iso/us/' + state;

	return function( callback ) {
		scrape( str, callback );
	};
}


function prepare_listings(err, $) {

	var listings = new Fetcher('listings').fetch();
	var base_urls = [],
		listings_array = [];

	if(err) {
		console.log(err);
	} else {

		$('#list a').each(function(index, elem) {
			base_urls.push( $(this).attr('href') );
		});

	}

	listings(function (error, response, body) {

		if (!error && response.statusCode == 200) {

			var data = JSON.parse(body);

			listings_array = u.map( data, function( l ) {
				return new Listing( l );
			});

		}

		run_scrape(listings_array, base_urls);
	});

}


function run_scrape( listings, urls ) {

	var query_strs = [],
		temp = [],
		flat = [];

	temp = u.map( listings, function( l ) {
		return l.cl_queries( urls );
	});

	flat = u.flatten(temp);

	scrape( flat[0], handle_document, { 'reqPerSec': 10 });
}


function handle_document(err, $) {
	if(err) {
		console.log(err);
	} else {
		$('#toc_rows .ban b').each(function(index, elem) {
			log_element( $(this), index );
		});
	}
}

function log_element( elem, i ) {
	console.log( elem.html() );
}


var city_getter = get_all_cities('ca');
*/
// city_getter( prepare_listings );














/*request('http://localhost:3000/api/cities', function(error, response, body) {
	cities.list = u.map(JSON.parse(body), function(e) { return e.name; });

	request('http://localhost:3000/api/listings', function(error, response, body) {
		listings.list = u.map(JSON.parse(body), function(e) { return e; });

		console.dir( cities, listings )
	});
});*/

/*
function make_query_strings( listing_arry, cities_array ) {

	// Cities to search in
	// var cities = ['sfbay', 'sandiego'];
	
	// Make an array of search strings for cl
	var cl_query_strs = [],
		all_query_strs = [];

	// Fill the query_strs array with values from listings in the listings_arry
	function fill_queries(c) {
		u.each( listing_arry, function (l) {
			cl_query_strs.push( Scraper.cl_query( l, c ) );
		});
	}

	// For each city, generate a query string of each listing in listing_arry
	u.each( cities_array, function(city) { fill_queries(city); } );

	// Make one for ebay
//	var eb_query_strs = [];

	// all_query_strs = cl_query_strs.concat(eb_query_strs);
	all_query_strs = cl_query_strs;

	// console.log( all_query_strs );
	return all_query_strs;
}

var Scraper = {

	// Craigslist query broken down
	'cl_strings': {
		protocall: 'http://',								// + city
		base_url: '.craigslist.org/search/sss?query=',		// + query
		mid_url: '&srchType=A',								// ??
		min_ask: '&minAsk=',								// + min_price...
		max_ask: '&maxAsk='
	},

	// Ebay string
	'eb_strings': {
		base_url: 'http://motors.shop.ebay.com/Motorcycles-/6024/i.html?LH_Distance=95110..200&_nkw=', // + query 
		end_url: '&_dmpt=US_motorcycles&_fpos=95110&_from=R7&_fsct=0&_fspt=1&_gcs=14&_ipg=50&_pcats=6000&_sadis=200&_sofindtype=22&_sop=1&_rdc=1'
	},

	// Scraper queries
	'cl_query': function( obj, city ) {
		return encodeURI( this.cl_strings.protocall + city + this.cl_strings.base_url + obj.name + this.cl_strings.mid_url + this.cl_strings.min_ask + obj.min + this.cl_strings.max_ask + obj.max );
	},

	'eb_query': function( obj ) {
		return encodeURI( this.eb_strings.base_url + obj.name + this.eb_strings.end_url );
	},

	'scrape': function( query_str_array, callback ) {
		scrape( query_str_array, callback, { 'reqPerSec': 4 });
	}
}

function api_req( resource, callback ) {
	request('http://localhost:3000/api/'+resource, callback);
}

function log_element( elem, i ) {
	console.log( i + ': ' + elem.text().trim() );
}

function handle_document(err, $) {
	if(err) {
		console.log(err);
	} else {
		$('#toc_rows .ban b').each(function(index, elem) {
			log_element($(this), index);
		});
	}
}

function setup_scraper(error, response, body) {
	if (!error && response.statusCode == 200) {
		// response is in string format
		var c = u.map(JSON.parse(body), function(e) { return e.name; });

		api_req('listings', function (error, response, body) {
			if (!error && response.statusCode == 200) {

				var l = JSON.parse(body),
					strs = make_query_strings( l, c );

				Scraper.scrape(strs, handle_document);
			}
		});
	}
}

function get_cities() {
	api_req('cities', setup_scraper);	
}

get_cities();
*/
