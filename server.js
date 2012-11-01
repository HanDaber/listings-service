
/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , http = require('http')
  , routes = require('./routes')
  , u = require('underscore')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Configure express
var app = express();

var db_host, db_name;

// Connect to db depending on environment
if (process.env.MONGOHQ_URL) {
	console.log(process.env.MONGOHQ_URL);
	db_host = process.env.MONGOHQ_URL;
} else {
	console.log('using local db\n');
	db_host = 'localhost';
	db_name = 'cl-scraper-03';
}
mongoose.connect(db_host, db_name);

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set("view options", {layout: false});
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
  app.enable("jsonp callback");
	app.use(express.cookieParser('8345t84y57t84t87y45th87y45t8y4538t7v58ntcyt3485t45ct87857tyv'));
	app.use(express.session('4352084576294857v956984693487698347679486797832465274f5845'));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});



// Define listing properties
var listing_properties = {
	name: String,
	min: { type: Number, default: 500 },
	max: { type: Number, default: 2500 }
}
// Define Listing schema
var listingSchema = new Schema( listing_properties );
// Define Listing Model from schema
var listingModel = mongoose.model( 'Listing', listingSchema );


// Enable cross domain requests
app.all('/api', function(req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('Charset', 'utf-8');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.get('/', routes.index);

// REST API
app.get('/api', function (req, res) {
  res.send('API is running');
});

// POST to CREATE
app.post('/api/listings', function (req, res) {
	var listing;
	console.log("POST: ");
	console.log(req.body);
	listing = new listingModel({
		name: req.body.name
	});
	listing.save(function (err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});
	return res.send(listing);
});

// =====================  Bulk destroy all listings
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

// PUT to UPDATE

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

// Single update
app.put('/api/listings/:id', function (req, res) {
  return listingModel.findById(req.params.id, function (err, listing) {
    listing.name = req.body.name;
    return listing.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(listing);
    });
  });
});

// GET to READ

// List listings
app.get('/api/listings', function (req, res) {
  return listingModel.find(function (err, listings) {
    if (!err) {
      return res.send(req.query.callback + '(' + listings + ');');
    } else {
      return console.log(err);
    }
  });
});

// Single listing
app.get('/api/listings/:id', function (req, res) {
  return listingModel.findById(req.params.id, function (err, listing) {
    if (!err) {
      return res.send(listing);
    } else {
      return console.log(err);
    }
  });
});

// DELETE to DESTROY

// remove a single listing
app.delete('/api/listings/:id', function (req, res) {
  return listingModel.findById(req.params.id, function (err, listing) {
    return listing.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});