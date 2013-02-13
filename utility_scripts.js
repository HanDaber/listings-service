var request = require('request');

// function write_file ( name, contents, callback ) {
// 	fs.writeFile( "./" + name, contents, callback ); // callback(err)
// }

function http_req ( req_uri, callback ) {

	request({ uri: req_uri }, function ( err, response, body ) {
		if( err || response.statusCode !== 200 ) { console.log('Request error: ' + err) }
		else { callback( body ) }
	});
}
exports.http_req = http_req;

















