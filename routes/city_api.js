var cityModel = require('../city_model'),
	u = require('underscore');

exports.all_cities = function (req, res) {

	return cityModel.find(function (err, cities) {
		if (!err) {
			res.send( cities );
		} else {
			console.log(err);
		}
	});

};

exports.create_city = function (req, res) {
	
	var name = (req.body.name === '') ? 'none' : req.body.name;
	
	var city = new cityModel({
		'name': name
	});

	return city.save(function (err) {
		if (!err) {
			res.send( city );
		} else {
			console.log(err);
		}
	});

};