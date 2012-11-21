var listingModel = require('../listing_model'),
	ScraperControl = require('../control');

exports.scrape = function (req, res) {

	return listingModel.find(function (err, listings) {
		if (!err && req.body.email) {

			res.send( 'OK' );
			
			var scraper = new ScraperControl( listings );
			
			scraper.start(req.body.email);
		} else {
			console.log(err);
		}
	});

};