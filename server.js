/**
 * Module dependencies.
 */

var express = require('express'),
	redis_store = require('connect-redis')(express),
    path = require('path'),
    http = require('http'),
    db = require('./db'),
    routes = require('./routes'),
    ListingManager = require('./routes/listing_api'),
    UserManager = require('./routes/user_api'),
    Mailer = require('./scraper_modules/mailer'),
    Scraper = require('./scraper_modules/scraper');

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
app.get( '/api/dev/scrape', function (req, res) {
	Scraper.scrape(function ( results ) {
		console.dir( '...scraped...' );
		res.send('OK');
	});
});

// All listings for User
app.get( '/api/listings/:user_id', ListingManager.all );

// Single listing
// app.get( '/api/listings/:id', ListingManager.find );

// Create a listing
app.post( '/api/listings', ListingManager.create );

// Update one listing
// app.put( '/api/listings/:id', ListingManager.update );

// Delete one listing
app.post( '/api/listings/:id', ListingManager.destroy );

// Email one Listing
app.get( '/api/mail/:id', ListingManager.pipe_results, UserManager.pipe_email, function (req, res) {
	var mail = new Mailer(                                                                                                             'handaber@gmail.com', '!6infuckinsaniuM9');
	mail( req.email, req.results );

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end();
});


app.get( '/:name', UserManager.manager );
app.post( '/:name', UserManager.find_or_create );
app.post( '/update/:user_id', UserManager.update_email );


http.createServer( app ).listen( app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



// END