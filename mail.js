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
	fn = require('underscore'),
	db = require('./db'),
	ListingManager = require('./routes/listing_api'),
	userModel = require('./routes/user_api');



// initialize
var mail = new Mailer('handaber@gmail.com', '!6infuckinsaniuM9');


userModel.all(function ( users ) {

	fn.each( users, function ( user ) {

		if( user.email !== '' ) {

			ListingManager.get_all_results( user, function ( results ) {

				mail(user.email, results);

			});

		} else {
			console.log('no email')
		}

	});

	setTimeout(function () {

		db.connection.close();

	}, 1000);

});

mail('handaber@gmail.com', 'Scraper Done Ran, Son... \n' + new Date());


// ListingManager.get_all_results(function ( results ) {

// 	mail(results);
	
// 	setTimeout(function () {

// 		db.connection.close();

// 	}, 1000);

// });



