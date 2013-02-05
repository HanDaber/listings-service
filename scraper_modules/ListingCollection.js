var listingModel = require('../listing_model'),
	u = require('underscore');

function ListingCollection () {
}
ListingCollection.prototype = {

	'results' : function ( callback ) {

		listingModel.find(function (err, listings) {
			if (err) {
				console.log(err);
			} else {

				u( listings ).map(function( listing ) {
					
					callback( listing.results );

				};);

			}
		});

	}
};