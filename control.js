// require
var Mailer = require('./scraper/mailer'),
	Scraper = require('./scraper/scraper'),
	Fragment = require('./scraper/fragment'),
	Fetcher = require('./scraper/fetcher'),
	Listing = require('./scraper/scraper_listing'),
	async = require('async'),
	u = require('underscore');


// initialize
var mail = new Mailer('handaber@gmail.com'),
	fragment = new Fragment(),
	listing_fetcher = new Fetcher('http://listings-service.herokuapp.com/api/'),
	city_scraper = new Scraper();



var base_urls = [];

city_scraper.get_all_cities( 'ca', function ( err, $ ) {

	if(err) { console.log(err) } 
	else {

		$('#list a').each(function(index, elem) {
			base_urls.push( $(this).attr('href') );
		});

		listing_fetcher.fetch('listings', build_queries);

	}
});





function build_queries(error, response, body) {
	if (!error && response.statusCode == 200) {

		var urls = [],
			items = JSON.parse(body);

		urls = u.map( items, function ( item ) {
			var temp = new Listing( item );
			return temp.cl_queries( base_urls );
		});

		var scraper_queries = u.flatten( urls ),
			scraper = new Scraper( scraper_queries );

		run_scrape( scraper );

	} else {
		console.log(error);
	}
}


function run_scrape ( scraper ) {

	// collect fragments returned from each scrape
	fragment.collect( scraper );

	// wait until all scrapes have returned before emailing them
	async.whilst(
		function () {
			if ( fragment.count < scraper.urls.length ) {
				return true;
			} else {
				return false;
			}
		},
	    function (callback) {
	    	console.log('scRaping (tm)...');
	        setTimeout(callback, 2000);
	    },
	    function (err) {
	    	var body = '<ul>' + fragment.list.toString() + '</ul>';
	    	mail( body );
	    }
	);
}

/*
fragment.collect ( scraper );

async.whilst(
	function () {
		if ( fragment.count < scraper.urls.length ) {
			return true;
		} else {
			return false;
		}
	},
    function (callback) {
    	console.log('scRaping (tm)...');
        setTimeout(callback, 2000);
    },
    function (err) {
    	var body = '<ul>' + fragment.list.toString() + '</ul>';
    	mail( body );
    }
);*/