var Scraper = require('./scraper_modules/scraper'),
	http = require('http');

Scraper.scrape(function ( results ) {
	console.dir( '...scraped...' );

	setTimeout(function () {
	    http.request("http://listings-service.herokuapp.com", function ( response ) { console.log("req'd"); });
	}, 1000);
});