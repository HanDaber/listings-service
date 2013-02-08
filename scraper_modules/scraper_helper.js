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

		var html = '';

		fn.each( listing.results, function( R ) {
			html += "<p><div style=" + "\"background:#eee;padding:8px;mragin-top:8px;border-bottom:1px solid #bbb\"" + ">" + "<a href=\"" + R.link + "\">" + R.title + "</a></div></p>";
		});

		return html;

	} else {
		return null;
	}


}