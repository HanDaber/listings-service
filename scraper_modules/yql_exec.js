var http = require('http');

function list ( arr ) {
    
    var list = "";
    
    for ( var i=0, l=arr.length; i<l; i++) {

        if (i > 0) list += ', ';
        
        list += "\"" + arr[i] + "\"";
    }

    return list;
}

// callback = function(response) {
//     var str = '';

//     //another chunk of data has been recieved, so append it to `str`
//     response.on('data', function (chunk) {
//         str += chunk;
//     });

//     //the whole response has been recieved, so we just print it out here
//     response.on('end', function () {

//     	var obj = JSON.parse(str);
        
//         console.dir( obj.query.results );

//     });
// }

exports.exec = function ( listing, callback ) {

    // console.log('YQL.exec(\n' + listing + '\n)');

    var keyword = listing.name,
        max_price = listing.max,
        min_price = listing.min,
        cities = listing.cities,
        last_scraped = listing.last_scraped;

    var base = "/v1/public/yql?q=",
        table = "use \"https://raw.github.com/HanDaber/yql-tables/master/craigslist/craigslist.search.listings.xml\" as listings; ",
        query = "select item from listings where location in (" + list(cities) + ") and type=\"sss\" and query=\"" + keyword + "\" and minAsk=\"" + min_price + "\" and maxAsk=\"" + max_price + "\" and item.date > \"" + last_scraped + "\" limit 100",
        opts = "&format=json&env=store://datatables.org/alltableswithkeys&callback=";

        
                                                                console.log('query: ' + query + '\n');


    var uri = "" + base + encodeURIComponent(table) + encodeURIComponent(query) + opts;
    // var uri = "" + base + encodeURIComponent(table) + encodeURIComponent(query) + opts;

    var options = {
        host: 'query.yahooapis.com',
        path: uri
    };

    http.request(options, function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {

            var obj = JSON.parse(str),
                res = [];

            if ( obj.query ) {
                res = obj.query.count > 0 ? obj.query.results.RDF : res;
            }
            
            callback( null, res );

        });
    }).end();
};






