var cities = ['newyork', 'chico', 'sfbay'],
    keyword = "iphone",
    max_price = 500;

var base = "/v1/public/yql?q=";

var table = "use \"https://raw.github.com/HanDaber/yql-tables/master/craigslist/craigslist.search.listings.xml\" as listings; ";

var query = "select item from listings where location in (" + list(cities) + ") and type=\"sss\" and query=\"" + keyword + "\" and maxAsk=\"" + max_price + "\" and item.date > \"" + right_now() + "\"";

var options = "&format=json&env=store://datatables.org/alltableswithkeys&callback=";

var uri = "" + base + encodeURIComponent(table) + encodeURIComponent(query) + options;

var http = require('http');

var options = {
    host: 'query.yahooapis.com',
    path: uri
};

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

callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

    	var obj = JSON.parse(str);
        
        console.dir( obj.query.results.RDF );

    });
}

console.dir(query);

http.request(options, callback).end();