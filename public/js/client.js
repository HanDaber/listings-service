$(function() {

    var email_pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/);

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
            $_elem.find('.results').append( '( ' + obj.results.length + ' )');
            $_elem.find('.min').append( obj.min );
            $_elem.find('.max').append( obj.max );

            if ( obj.cities ) {
                var $_cities = $_elem.find('.cities');
                for ( var i=0, c=obj.cities.length; i < c; i++) {
                    if ( i > 0 ) $_cities.append( ", " );
                    $_cities.append( obj.cities[i] );
                }
            }
            
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

    function post_scrape ( obj, callback ) {
        $.post("/api/scrape", obj, callback);
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
        var $_elem = $(this).parents('form');

        var name = $_elem.find( "input[name=listing_name]" ).val(),
            type = $_elem.find( "select[name=listing_type]" ).val(),
            min = $_elem.find( "input[name=listing_min]" ).val(),
            max = $_elem.find( "input[name=listing_max]" ).val();
            cities = $_elem.find( "select[name=listing_cities]" ).val();

        var new_listing = { 'type': type, 'name': name, 'min': min, 'max': max, 'cities': cities };

        $("tr#roading").html("<div class='alert'>Saving...</div>").fadeIn();

        $.post("/api/listings", new_listing, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            $('tr#roading').fadeOut().html('');

            manager.append( data );
        });

        clear_form( $_elem );

        return false;
	});


    // LOTS OF COPYPASTA EVERYWHERE --- REFACTOR THIS SHIT, MAN --- 


    var del_forms = $('form.edit_listing');

    $_listings.on('click', 'button', function(event) {

        event.preventDefault();

        var _id = $(this).attr('id');

        var p = $(this).parents('tr');

        p.css('color', '#bbb');
        p.css('background', '#eee');
        $(this).addClass('disabled').off('click');

        $.post("/api/listings/"+_id, _id, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            if( data._id && data._id == _id ) { p.fadeOut(); }
        });

    });


    // var scrape_form = $('form#scrape');

    // scrape_form.on('click', 'button', function( event ) {
        
    //     event.preventDefault();

    //     var $_elem = $(this),
    //         $_email = $_elem.siblings('input[name=email]'),
    //         email = $_email.val(),
    //         msg = scrape_form.find('p');


    //     if ( email_pattern.test( email ) ) {

    //         $_email.val('');

    //         msg.addClass('alert alert-success').html('Scraping... check your email in a few minutes.').fadeIn();

    //         $_elem.addClass('disabled').fadeOut();

    //         post_scrape({'email' : email}, function(data, textStatus, jqXHR) {

    //             if (textStatus === 'success') {
    //                 setTimeout(function () {
    //                     $_elem.fadeIn().removeClass('disabled');
    //                     msg.fadeOut().removeClass('alert-error alert-success');
    //                     msg.html('');
    //                 }, 2500);
    //                 // $_elem.fadeIn().removeClass('disabled');
    //                 // msg.html('');
    //             }

    //         });

    //     } else {
    //         msg.addClass('alert alert-error').html('Invalid email, try again...').fadeIn();
    //     }

    // });
    
});