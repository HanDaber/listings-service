var fn = require('underscore');

function leading_zero ( n ) {

    if ( n < 10 ) return '0' + n;

    else return n;
}

exports.right_now = function () {

    var now = new Date();
    
    return ( now.getFullYear() + '-' + leading_zero( now.getMonth() + 1 ) + '-' + leading_zero( now.getDate() ) + 'T' + leading_zero( now.getHours() ) + ':' + leading_zero( now.getMinutes() ) + ':' + leading_zero( now.getSeconds() ) + '' ); // > 12 ? now.getHours() - 12 : now.getHours()
};

exports.a_month_ago = function () {

    var now = new Date();
    
    return ( now.getFullYear() + '-' + leading_zero( now.getMonth() ) + '-' + leading_zero( now.getDate() ) + 'T' + leading_zero( now.getHours() ) + ':' + leading_zero( now.getMinutes() ) + ':' + leading_zero( now.getSeconds() ) + '' );
};

exports.build_results = function ( listing ) {

	if ( listing.results.length > 0 ) {

		var html = "<div style=\"border-bottom:1px solid #444; margin-bottom:20px;\"><h3><u>" + listing.name + "</u> (" + listing.results.length + "):</h3>";

		fn.each( listing.results, function( R, index ) {
			html += "<p><div style=\"background:#eeeeee; padding:8px; font-size: 12pt; mragin-top:8px; border-bottom:1px solid #fefefe;\">" + (index + 1) + ") <a href=\"" + R.link + "\">" + R.title + "</a></div>";
			html += "<div style=\"background:#efefef; padding:5px 5px 5px 12px; font-size: 10pt; mragin-top:2px; border-bottom:1px solid #aaa;\">" + R.desc + "</div></p>";
		});

		html += "</div>";

		return html;

	} else {
		return null;
	}


}