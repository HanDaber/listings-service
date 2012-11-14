$(function() {

    // $_name denotes that name is an HTMLElement
    var $_listings = $('.listings').find('ul'),
        $_listing = $_listings.find('.template');

    // Define the Manager object
    function Manager( element ) {
        this.element = element;
    }
    Manager.prototype = {
        'save': function( callback ) {
            callback( this );
        },
        'append': function( obj ) {
            var $_elem = new_from_template( $_listing );

            $_elem.find('.name').append( obj.name );
            $_elem.find('.type').append( obj.type );
            $_elem.find('.price').find('.min').append( obj.min );
            $_elem.find('.price').find('.max').append( obj.max );
            
            $_listings.append( $_elem );
        }
    }

    function clear_form( $_elem ) {
        $_elem.find( "input" ).val('');
    }

    function new_from_template( $_elem ) {
        return $_elem.clone().removeClass('template');
    }




    var manager = new Manager( $_listings ),
        listing_form = $("form[name=add_listing_form]");

    $.get("/api/listings", function(data, textStatus, jqXHR) {
        //console.log("Get resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        for( key in data ) {
            manager.append( data[key] );
        }
    });

	listing_form.on('submit', function( event ) {
    	
    	event.preventDefault();
        var $_elem = $(this);

        var name = $_elem.find( "input[name=listing_name]" ).val(),
            type = $_elem.find( "input[name=listing_type]" ).val(),
            min = $_elem.find( "input[name=listing_min]" ).val(),
            max = $_elem.find( "input[name=listing_max]" ).val();

        var new_listing = { 'type': type, 'name': name, 'min': min, 'max': max };

        $.post("/api/listings", new_listing, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            manager.append( data );
        });

        clear_form( $_elem );

        return false;
	});
    
});