var db = require('./db'),
	Scraper = require('./scraper_modules/scraper'),
	http_req = require('./utility_scripts').http_req;

Scraper.scrape(function ( results ) {
	console.dir( '...scraped...' );

	setTimeout(function () {
		db.connection.close();

		http_req('http://listings-service.herokuapp.com', function ( resp ) {
			console.log(resp)
		});
	}, 500);
});