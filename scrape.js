var Scraper = require('./scraper_modules/scraper');

Scraper.scrape(function ( results ) {
	console.dir( results.toString() );
});