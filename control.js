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
var Mailer = require('./scraper_modules/mailer'),
	db = require('./db'),
	ListingManager = require('./routes/listing_api');



// initialize
var mail = new Mailer('handaber@gmail.com', '!6infuckinsaniuM9');



ListingManager.get_all_results(function ( results ) {

	mail(results);
	
	setTimeout(function () {

		db.connection.close();

	}, 1000);

});



