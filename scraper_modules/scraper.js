var async = require('async'),
    ListingManager = require('../routes/listing_api'),
    YQL = require('./yql_exec');



function Scrape ( callback ) {

	console.log('scraping...');

	ListingManager.get_all( function ( listings ) {

		console.log('Got ' + Object.prototype.toString.apply( listings ) + ' of size ' + listings.length + ' listings from db');

		async.map( listings, YQL.exec, function ( err, results ) {
			
			for ( var i = 0, r = results.length; i < r; i++ ) {

				var R = results[i];

				console.log('Adding ' + R.length + ' results to listing #' + listings[i]._id);
				
				ListingManager.add_results( listings[i]._id, R ); }

			if ( callback && typeof(callback) === 'function' ) {
					
				callback( results ); }
		});

	});
}


exports.scrape = Scrape;