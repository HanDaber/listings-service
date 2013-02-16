// require
var Mailer = require('./scraper_modules/mailer'),
	fn = require('underscore'),
	db = require('./db'),
	ListingManager = require('./routes/listing_api'),
	userModel = require('./routes/user_api');

var result_count = 0;

var mail = new Mailer(																																																																	'handaber@gmail.com', '!6infuckinsaniuM9');

userModel.all(function ( users ) {

	fn.each( users, function ( user ) {

		if( user.email !== '' ) {

			ListingManager.get_all_results( user, function ( results ) {

				var body = '<h2>Latest scrape results:</h2><h3>Manage your listings at <a href="http://www.listings-app.com/' + user.name + '">listings-app.com/' + user.name + '</a></h3><hr>';
				body += results.join('');

				mail(user.email, body);

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

