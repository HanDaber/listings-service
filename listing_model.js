var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// ######## LISTING #######################################################
// Define listing properties
var listing_properties = {
  	'type': { type: String, default: 'listing' },
	'name': { type: String, default: 'none' },
	'min': { type: Number, default: 500 },
	'max': { type: Number, default: 2500 }
}
// Define Listing schema
var listingSchema = new Schema( listing_properties );
// Define Listing Model from schema
var listingModel = mongoose.model( 'Listing', listingSchema );

module.exports = listingModel;
/*module.exports = {
	'model': function() {
		return listingModel;
	},
	'all': function( callback ) {

		var arr = [];

		listingModel.find(function (err, listings) {
			if ( err ) {
				console.log( err );
			} else {
				arr.push( listings );
			}
		});

		return arr;
	}
};

var a = module.exports.all(function ( listing ) {
	return listings;
});
console.log(a);*/