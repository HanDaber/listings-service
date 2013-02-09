var userModel = require('../user'),
	u = require('underscore');

exports.manager = function(req, res) {
	
	var username = req.params.name;

	return userModel.findOne({ 'name': username }, function ( err, user ) {
		
		if (err) {
		
			console.log(err);
		
			res.redirect('/');

		} else {
			
			console.dir( user );

			if ( user == null ) {

				res.redirect('/');

			} else {
		
				res.render('manager', { locals: {
					'user': user 
				}});
		
			}
		
		}
	
	});
};

exports.update_email = function ( req, res ) {

	console.log(req.body, req.params)
	
	var email = req.body.email,
		user_id = req.params.user_id;

	return userModel.findById( user_id, function ( err, user ) {

		user.email = email;

		return user.save(function (err) {
			if (!err) {

				console.log('updated user ' + user.email)
				res.send(user.email);

			} else {
				console.log(err);
			}
			console.dir(user)
		});
	});
};

exports.all = function ( callback ) {

	return userModel.find( function ( err, users ) {
		if(!err) {
			callback( users );
		} else {
			console.log(err);
		}
	});

};

exports.find_or_create = function ( req, res ) {

	var name = req.params.name,
		key = req.body.key,
		mykey = 'balls ' +  new Date().getDate();

	return userModel.findOne({ 'name': name }, function ( err, user ) {
		
		if ( user != null && key == null ) {
			
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("<a href=\"/" + user.name + "\">YEP</a>");

		} else if ( key === mykey ) {

			var user = new userModel({
				'name': name
			});

			return user.save(function (err) {
				
				if (!err) {

					console.log('created user ' + user.name)

					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end("<a href=\"/" + user.name + "\">YEP</a>");

				} else {
					console.log(err);
				}
			});

		} else if ( key === 'annihilate' ) {

			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("<span>" + user.name + " got pooped on.</span>");

			exports.destroy( user._id );

		} else {
			res.writeHead(418, {'Content-Type': 'text/plain'});
			res.end();
			console.log('NOPE')
		}
	});

};

/*
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
*/
/*
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
*/


exports.destroy = function ( user_id ) {

	return userModel.findById(user_id, function (err, user) {

		return user.remove(function (err) {
			if (!err) {
				console.log( 'user ' + user.name + ' was removed.' );
			} else {
				console.log(err);
			}
		});

	});

};