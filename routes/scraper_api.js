var listingModel = require('../listing_model'),
	ScraperControl = require('../control');

exports.scrape = function (req, res) {

	res.send( 'start' );

	return listingModel.find(function (err, listings) {
		if (!err && req.body.email) {

			var scraper = new ScraperControl( listings );
			
			(function () {
				scraper.start( req.body.email );
			})();

			res.end( 'done' );

		} else {
			console.log(err);
		}
	});

};