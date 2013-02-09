var listingModel = require('../scraper_modules/listing'),
	u = require('underscore'),
	scraper_helper = require('../scraper_modules/scraper_helper');

exports.test = function (req, res) {
	res.send('API is running');
};

exports.all = function (req, res) {

	return listingModel.find(function (err, listings) {
		if (!err) {
			res.send( listings );
		} else {
			console.log(err);
		}
	});

};

exports.get_all = function ( callback ) {

	return listingModel.find(function (err, listings) {
		if (!err) {
			callback( listings );
		} else {
			console.log(err);
		}
	});

};

exports.get_all_results = function ( callback ) {

	return listingModel.find(function (err, listings) {

		if (!err) {

			var results = u.map( listings, function ( L ) {

				var R = scraper_helper.build_results( L );

				if ( R != null ) {
					exports.remove_results( L );
				}

				return R;
			} );

			results = u.compact( results );

			if ( results.length > 0 ) {

				callback( results.join('') );

			} else {

				console.log('no new results found.')

				listingModel.connection.close();
			}

		} else {
			console.log(err);
		}
	});

};

exports.find = function (req, res) {

	return listingModel.findById(req.params.id, function (err, listing) {
		if (!err) {
			res.send( listing );
		} else {
			console.log(err);
		}
	});

};

exports.create = function (req, res) {

	if (req.body.name === '' || req.body.cities === '') {
		res.writeHead(418, {'Content-Type': 'text/plain'});
		res.end();
	} else {

		var type = (req.body.type === '') ? 'for sale' : req.body.type;
		// var name = (req.body.name === 'none') ? '' : req.body.name;
		var min = (req.body.min === '') ? '0' : req.body.min;
		var max = (req.body.max === '') ? '2500' : req.body.max;
		// var cities = (req.body.cities === '') ? '' : req.body.cities;
		
		var listing = new listingModel({
			'type': type,
			'name': req.body.name,
			'min': min,
			'max': max,
			'cities': req.body.cities
		});

		return listing.save(function (err) {
			if (!err) {
				res.send( listing );
			} else {
				console.log(err);
			}
		});

	}

};

exports.update = function (req, res) {

	return listingModel.findById(req.params.id, function (err, listing) {

		listing.type = req.body.type;
		listing.name = req.body.name;
		listing.min = req.body.min;
		listing.max = req.body.max;
		listing.cities = req.body.cities;

		return listing.save(function (err) {
			if (!err) {
				res.send( listing );
			} else {
				console.log(err);
			}
		});

	});

};


exports.remove_results = function ( listing ) {

	return listingModel.findById( listing._id, function (err, listing) {

		listing.results = [];

		return listing.save(function (err) {
			if (!err) {
				console.log( 'updated listing: ' + listing.name );
			} else {
				console.log(err);
			}
		});

	});

};


exports.add_results = function (listing_id, results) {

	listingModel.findById(listing_id, function (err, listing) {

		if ( results.length > 0 ) {

				u.each(results, function( R ) {
					console.log('Adding Result from: ' + R.item.date); // .replace('T', ' ').substring(0, R.item.date.length - 6)
					listing.results.push( {
						link: R.item.link,
						title: R.item.title,
						date: R.item.date
					} );
				});

			// var newest = u.filter( results, function ( R ) {
				
			// 	if ( R.item.date.replace('T1', ' ').replace('T2', ' ').substring(0, R.item.date.length - 6) > listing.last_scraped.replace('-08:00', '') ) {
			// 		return true;
			// 	} else { false }

			// 	// return R.date > listing.last_scraped;
			// });

			// if ( newest.length > 0 ) {
			// 	u.each(newest, function( R ) {
			// 		listing.results.push( R.item );
			// 	});
			// }

		}

		listing.last_scraped = scraper_helper.right_now();


		return listing.save(function (err) {
			if (!err) {
				console.log( 'Scraped ' + listing.name + ' successfully at ' + listing.last_scraped );
			} else {
				console.log(err);
			}
		});

	});

};

exports.destroy = function (req, res) {

	return listingModel.findById(req.params.id, function (err, listing) {

		return listing.remove(function (err) {
			if (!err) {
				res.send( listing );
			} else {
				console.log(err);
			}
		});

	});

};