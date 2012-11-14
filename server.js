/**
 * Module dependencies.
 */

var express = require('express'),
  path = require('path'),
  http = require('http'),
  db = require('./db'),
  listingModel = require('./listing_model'),
  cityModel = require('./city_model'),
  routes = require('./routes'),
  listing_api = require('./routes/listing_api'),
  city_api = require('./routes/city_api');

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
app.get('/api', listing_api.test);

// All listings
app.get('/api/listings', listing_api.all_listings);

// =====================  Bulk destroy all listings ======================== TEMP
app.get('/api/listings/reset', function (req, res) {
  listingModel.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.redirect('/');
    } else {
      console.log(err);
    }
  });
});

// Single listing
app.get('/api/listings/:id', listing_api.one_listing);

// Create a listing
app.post('/api/listings', listing_api.create_listing);

// Update one listing
app.put('/api/listings/:id', listing_api.update_listing);

// Delete one listing
app.delete('/api/listings/:id', listing_api.delete_listing);

// Bulk update
/*app.put('/api/listings', function (req, res) {
    var i, len = 0;
    console.log("is Array req.body.listings");
    console.log(Array.isArray(req.body.listings));
    console.log("PUT: (listings)");
    console.log(req.body.listings);
    if (Array.isArray(req.body.listings)) {
        len = req.body.listings.length;
    }
    for (i = 0; i < len; i++) {
        console.log("UPDATE listing by id:");
        for (var id in req.body.listings[i]) {
            console.log(id);
        }
        listingModel.update({ "_id": id }, req.body.listings[i][id], function (err, numAffected) {
            if (err) {
                console.log("Error on update");
                console.log(err);
            } else {
                console.log("updated num: " + numAffected);
            }
        });
    }
    return res.send(req.body.listings);
});*/



app.get('/api/cities', city_api.all_cities);

app.post('/api/cities', city_api.create_city);


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});