// require
var Mailer = require('./scraper_modules/mailer'),
	fn = require('underscore'),
	db = require('./db'),
	ListingManager = require('./routes/listing_api'),
	userModel = require('./routes/user_api');

var result_count = 0;

var mail = new Mailer('handaber@gmail.com', '!6infuckinsaniuM9');

userModel.all(function ( users ) {

	fn.each( users, function ( user ) {

		if( user.email !== '' ) {

			ListingManager.get_all_results( user, function ( results ) {

				mail(user.email, results.join(''));

				result_count += results.length;

			});

		} else {
			console.log('user has no email')
		}

	});

	setTimeout(function () {

		db.connection.close();

	}, 500);

});

mail('handaber@gmail.com', 'Scraper Done Ran, Son... \n' + ' ( ' + result_count + ' ) results sent...\n' + new Date());

