var http = require('http');

function list ( arr ) {
    
    var list = "";
    
    for ( var i=0, l=arr.length; i<l; i++) {

        if (i > 0) list += ', ';
        
        list += "\"" + arr[i] + "\"";
    }

    return list;
}

function right_now () {

    var now = new Date();
    
    return ( now.getFullYear() + '-' + leading_zero( now.getMonth() + 1 ) + '-' + leading_zero( now.getDate() ) + ' ' + leading_zero( now.getHours() > 12 ? now.getHours() - 12 : now.getHours() ) + ':' + leading_zero( now.getMinutes() ) + ':' + leading_zero( now.getSeconds() ) );
}

function leading_zero ( n ) {

    if ( n < 10 ) return '0' + n;

    else return n;
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
        listing_id = listing._id;

    var base = "/v1/public/yql?q=",
        table = "use \"https://raw.github.com/HanDaber/yql-tables/master/craigslist/craigslist.search.listings.xml\" as listings; ",
        query = "select item from listings where location in (" + list(cities) + ") and type=\"sss\" and query=\"" + keyword + "\" and minAsk=\"" + min_price + "\" and maxAsk=\"" + max_price + "\" and item.date > \"" + right_now() + "\"",
        opts = "&format=json&env=store://datatables.org/alltableswithkeys&callback=";

        
                                                                console.log(query+'\n');


    var uri = "" + base + encodeURIComponent(table) + encodeURIComponent(query) + opts;

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
                res = obj.query.count > 0 ? obj.query.results.RDF : [];
            
            callback( null, res );

        });
    }).end();
};






