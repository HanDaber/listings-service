var listingModel = require('../listing_model'),
	u = require('underscore');

exports.test = function (req, res) {
	res.send('API is running');
};

exports.all_listings = function (req, res) {

	return listingModel.find(function (err, listings) {
		if (!err) {
			res.send( listings );
		} else {
			console.log(err);
		}
	});

};

exports.one_listing = function (req, res) {

	return listingModel.findById(req.params.id, function (err, listing) {
		if (!err) {
			res.send( listing );
		} else {
			console.log(err);
		}
	});

};

exports.create_listing = function (req, res) {
	
	var type = (req.body.type === '') ? 'listing' : req.body.type;
	var name = (req.body.name === '') ? 'none' : req.body.name;
	var min = (req.body.min === '') ? '500' : req.body.min;
	var max = (req.body.max === '') ? '2500' : req.body.max;
	
	var listing = new listingModel({
		'type': type,
		'name': name,
		'min': min,
		'max': max
	});

	return listing.save(function (err) {
		if (!err) {
			res.send( listing );
		} else {
			console.log(err);
		}
	});

};

exports.update_listing = function (req, res) {

	return listingModel.findById(req.params.id, function (err, listing) {

		listing.type = req.body.type;
		listing.name = req.body.name;
		listing.min = req.body.min;
		listing.max = req.body.max;

		return listing.save(function (err) {
			if (!err) {
				res.send( listing );
			} else {
				console.log(err);
			}
		});

	});

};

exports.delete_listing = function (req, res) {

	return listingModel.findById(req.params.id, function (err, listing) {

		return listing.remove(function (err) {
			if (!err) {
				res.send('');
			} else {
				console.log(err);
			}
		});

	});

};