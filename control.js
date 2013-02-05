/*

App:
	Server:
		Listings
		Results
		User
		Scraper:
		Mailer:
	Client:
		Manager:

*/


// require
var Mailer = require('./scraper/mailer'),
	Scraper = require('./scraper/scraper'),
	Fragment = require('./scraper/fragment'),
	Fetcher = require('./scraper/fetcher'),
	Listing = require('./scraper_modules/listing'),
	async = require('async'),
	u = require('underscore');



// initialize
var mail = new Mailer('handaber@gmail.com'),
	fragment = new Fragment(),
	listing_fetcher = new Fetcher('http://listings-service.herokuapp.com/api/'),
	city_scraper = new Scraper();


var base_urls = [
	'http://sfbay.craigslist.org/',
	'http://bakersfield.craigslist.org/',
	'http://chico.craigslist.org/',
	'http://fresno.craigslist.org/',
	'http://goldcountry.craigslist.org/',
	'http://hanford.craigslist.org/',
	'http://humboldt.craigslist.org/',
	'http://imperial.craigslist.org/',
	'http://inlandempire.craigslist.org/',
	'http://losangeles.craigslist.org/',
	'http://mendocino.craigslist.org/',
	'http://merced.craigslist.org/',
	'http://modesto.craigslist.org/',
	'http://monterey.craigslist.org/',
	'http://orangecounty.craigslist.org/',
	'http://palmsprings.craigslist.org/',
	'http://redding.craigslist.org/',
	'http://reno.craigslist.org/',
	'http://sacramento.craigslist.org/',
	'http://sandiego.craigslist.org/',
	'http://slo.craigslist.org/',
	'http://santabarbara.craigslist.org/',
	'http://santamaria.craigslist.org/',
	'http://siskiyou.craigslist.org/',
	'http://stockton.craigslist.org/',
	'http://susanville.craigslist.org/',
	'http://ventura.craigslist.org/',
	'http://visalia.craigslist.org/',
	'http://yubasutter.craigslist.org/'
];

/*city_scraper.get_all_cities( 'ca', function ( err, $ ) {

	if(err) { console.log(err) } 
	else {

		$('#list a').each(function(index, elem) {
			base_urls.push( $(this).attr('href') );
		});

		console.log('base_urls: ');
		console.dir(base_urls);

		listing_fetcher.fetch('listings', build_queries);
	}
});*/

function Controller( collection ) {
	this.collection = collection;
}
Controller.prototype = {
	'start': function ( param ) {

		if ( param && (typeof( param ) == 'string') ) { 

			mail = new Mailer( param );
			console.log( 'mail to ' + param );

		} else if ( param && (typeof( param ) == 'function') ) {
			
			mail = param;

		}

		build_queries( null, {statusCode: 200}, JSON.stringify(this.collection) );

		if ( !param ) {
			console.log('invalid param in control.js');
		}
		
		if( !this.collection ) {
			console.log('Error: you did not pass a collection to controller');	
		}
	}
};
module.exports = Controller;

if( process.argv[2] == '--run' ) {
	var ctrl = new Controller();

	ctrl.start();
}


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

		console.log('scraper_queries size: ' + scraper_queries.length + '. running scraper.');

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
	    	console.log('scraping...');
	        setTimeout(callback, 2000);
	    },
	    function (err) {

	    	console.log('building email...');
	    	
	    	var body = fragment.compress();

	    	mail( body );
	    }
	);
}
