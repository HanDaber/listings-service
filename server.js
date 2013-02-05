/**
 * Module dependencies.
 */

var express = require('express'),
    path = require('path'),
    http = require('http'),
    db = require('./db'),
    routes = require('./routes'),
    ListingManager = require('./routes/listing_api');

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
	app.use(express.cookieParser('8345t84y57t84t87y45th87y45t8y4538t7v58ntcyt3485t45ct87857tyv'));
	app.use(express.session('4352084576294857v956984693487698347679486797832465274f5845'));
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
// app.get( '/api/scrape', ListingManager.scrape );

// All listings
app.get( '/api/listings', ListingManager.all );

// Single listing
app.get( '/api/listings/:id', ListingManager.find );

// Create a listing
app.post( '/api/listings', ListingManager.create );

// Update one listing
app.put( '/api/listings/:id', ListingManager.update );

// Delete one listing
app.post( '/api/listings/:id', ListingManager.destroy );

setInterval(function() {
  console.log('scrape + callback: mail()');
  console.log('mailing...done');
}, 5000 );

http.createServer( app ).listen( app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
