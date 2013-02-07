/**
 * Module dependencies.
 */

var express = require('express'),
	redis_store = require('connect-redis')(express),
    path = require('path'),
    http = require('http'),
    fn = require('underscore'),
    async = require('async'),
    db = require('./db'),
    routes = require('./routes'),
    ListingManager = require('./routes/listing_api'),
    YQL = require('./scraper_modules/yql_exec');

// Configure express
var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('8345t84y57t84t87y45693everm4876983476th87y45t8y4538t7v58ntcyt3485t45ct87857tyv'));
	app.use(express.session({ store: new redis_store, secret: '4352797832tcyt30845sherm76297y45t8y4538t7v5479486797832tcyt3485t4465274f5845' }));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

// Web routes
app.get( '/', routes.index );

// REST API
// app.get( '/api', ListingManager.test );

// app.post( '/api/scrape', ListingManager.scrape );
app.get( '/api/scrape', function (req, res) {
	Scrape();
	res.send('OK').end();
});

// All listings
app.get( '/api/listings', ListingManager.all );

// Single listing
// app.get( '/api/listings/:id', ListingManager.find );

// Create a listing
app.post( '/api/listings', ListingManager.create );

// Update one listing
// app.put( '/api/listings/:id', ListingManager.update );

// Delete one listing
app.post( '/api/listings/:id', ListingManager.destroy );



setInterval(Scrape, (5 * 60 * 1000) );
// Scrape();
function Scrape () {
	console.log('scraping...');

	ListingManager.get_all( function ( listings ) {

		console.log('Got ' + Object.prototype.toString.apply( listings ) + ' of size ' + listings.length + ' listings from db');

		async.map( listings, YQL.exec, function ( err, results ) {
			for ( var i = 0, r = results.length; i < r; i++ ) {

				var R = results[i];

				console.log('Adding ' + R.length + ' results to ' + listings[i].name);
				
				ListingManager.add_results( listings[i]._id, R );
			}
		});

	});
}

http.createServer( app ).listen( app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
