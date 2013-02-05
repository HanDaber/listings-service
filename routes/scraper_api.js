var listingModel = require('../scraper_modules/listing'),
	ScraperControl = require('../control');

exports.scrape = function (req, res) {

	var email = req.body.email;

	if ( email ) {

		listingModel.find(function (err, listings) {

			var scraper = new ScraperControl( listings );

			if (!err) {

				scraper.start( email );

				res.end();

			} else {
				console.log(err);
			}
		});

	} else {

		listingModel.find(function (err, listings) {

			var scraper = new ScraperControl( listings );

			if (!err) {

				scraper.start(function(html) {

					res.writeHead(200, {
						'Content-Length': html.length,
						'Content-Type': 'text/html'
					});

					res.end( html );

				});

			} else {
				console.log(err);
			}
		});

	}
};