// Require modules
var u = require('underscore'),
	scraper = require('scraper'),
	db = require('./db'),
	listingModel = require('./listing_model'),
	cityModel = require('./city_model');

var	all_query_strs = [];

function make_query_strings( listing_arry ) {

	// Cities to search in
	var cities = ['sfbay', 'sandiego'];
	
	// Make an array of search strings for cl
	var cl_query_strs = [];

	// Fill the query_strs array with values from listings in the listings_arry
	function fill_queries(c) {
		u.each( listing_arry, function (l) {
			cl_query_strs.push( Scraper.cl_query( l, c ) );
		});
	}

	// For each city, generate a query string of each listing in listing_arry
	u.each( cities, function(city) { fill_queries(city); } );

	// Make one for ebay
/*	var eb_query_strs = [];
	u.each(
		listings_array,
		function(l) {
			var temp = new Listing();
			temp.name = l.name;
			temp.min = l.min;
			temp.max = l.max;
			eb_query_strs.push( temp.eb_query() );
	});*/

	// all_query_strs = cl_query_strs.concat(eb_query_strs);
	all_query_strs = cl_query_strs;

	console.log( all_query_strs );
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
		var bodyHTML;

		scraper( query_str_array, function( err, $ ) {
			if (err) {
				throw err;
			} else {
				bodyHTML = $('body');
				callback( bodyHTML );
			}
		}, { 'reqPerSec': 4 });
	}
}

// Retrieve all listings and then scrape
exports.go = function( callback ) {	
	return listingModel.find(function ( err, data) {
		callback(err, data);
		db.connection.close();
	});
};

var bodies = exports.go(function (err, listings) {
	if (err) {
		console.log(err);
	} else {
		
		var listings_array = [],
			bodies_array = [];

		u.each(
			listings,
			function ( l ) {
				listings_array.push( l );
			}
		);

		make_query_strings( listings_array );

		Scraper.scrape( all_query_strs, function ( body ) {
			bodies_array.push( body );
		});

		return bodies_array;
	}
});

console.log( bodies.length );