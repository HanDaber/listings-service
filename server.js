/**
 * Module dependencies.
 */

var express = require('express'),
    path = require('path'),
    http = require('http'),
    db = require('./db'),
    routes = require('./routes'),
    listings = require('./routes/listing_api'),
    cities = require('./routes/city_api'),
    scraper = require('./routes/scraper_api');

// Configure express
var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set("view options", {layout: false});
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
app.get('/', routes.index);

// REST API
app.get('/api', listings.test);
app.post('/api/scrape', scraper.scrape);
app.get('/api/scrape', scraper.scrape);

// All listings
app.get('/api/listings', listings.all_listings);

// =====================  Bulk destroy all ======================== TEMP
/*app.get('/api/listings/reset', function (req, res) {
  listingModel.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.redirect('/');
    } else {
      console.log(err);
    }
  });
});
app.get('/api/cities/reset', function (req, res) {
  cityModel.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.redirect('/');
    } else {
      console.log(err);
    }
  });
});*/

// Single listing
app.get('/api/listings/:id', listings.one_listing);

// Create a listing
app.post('/api/listings', listings.create_listing);

// Update one listing
app.post('/api/listings/update/:id', listings.update_listing);

// Delete one listing
app.post('/api/listings/delete/:id', listings.delete_listing);

app.get('/api/cities', cities.all_cities);

app.post('/api/cities', cities.create_city);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
