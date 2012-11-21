$(function() {



    // $_name denotes that name is an HTMLElement
    var $_listings = $('.listings').find('tbody'),
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
            $_elem.find('.min').append( obj.min );
            $_elem.find('.max').append( obj.max );
            $_elem.find('input.listing_id').val( obj._id );
            $_elem.find('button').attr( 'id', obj._id );
            
            $_listings.append( $_elem );
        }
    }

    function clear_form( $_elem ) {
        $_elem.find( "input[type!=submit]" ).val('');
    }

    function new_from_template( $_elem ) {
        return $_elem.clone().removeClass('template');
    }

    function find_form( name ) {
        return $("form[name=" + name + "]");
    }



    var manager = new Manager( $_listings ),
        listing_form = find_form('listings'),

        cities_form = find_form('cities'),  // <=== ehhh....
        $_cities = cities_form.find('ul');

    $.get("/api/listings", function(data, textStatus, jqXHR) {
        //console.log("Get resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        for( key in data ) {
            manager.append( data[key] );
        }
    });

	listing_form.find('button').on('click', function( event ) {
    	
    	event.preventDefault();
        var $_elem = $(this).parent();

        var name = $_elem.find( "input[name=listing_name]" ).val(),
            type = $_elem.find( "select[name=listing_type]" ).val(),
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


    // LOTS OF COPYPASTA EVERYWHERE --- REFACTOR THIS SHIT, MAN --- 


    var del_forms = $('form.edit_listing'),
        del_btns = del_forms.find('button');

    $_listings.on('click', 'button', function(event) {

        event.preventDefault();

        var _id = $(this).attr('id');

        var p = $(this).parents('tr');

        $.post("/api/listings/delete/"+_id, _id, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            if( data._id && data._id == _id ) { p.remove(); }
        });

    });


    var scrape_form = $('form#scrape'),
        scrape_btn = scrape_form.find('button');

    scrape_form.on('click', 'button', function( event ) {
        
        event.preventDefault();

        var $_elem = $(this);

        $_elem.addClass('disabled');

        var email = $_elem.siblings('input[name=email]').val();

        $.post("/api/scrape", {'email': email}, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            
        });

        scrape_form.append('<p>check your email in a few minutes</p>');
    });
    
});