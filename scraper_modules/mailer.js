var nodemailer = require("nodemailer");

function Mailer ( email, pass ) {
    // create reusable transport method (opens pool of SMTP connections) // TODO: secure credentials in db
    // new Buffer("Hello World").toString('base64')
    var smtpTransport = nodemailer.createTransport("SMTP", { service: "Gmail", auth: { 'user': email, 'pass': pass }});

    return function ( body ) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: "listing-mailer", // sender address
            to: email, // list of receivers
            subject: "latest scrape results", // Subject line
            text: "Hello", // plaintext body
            html: "<div><h2>listings-service scrape results</h2><hr>"+body+"</div>" // html body
        };

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('mail error');
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages
        });
    };
}

module.exports = Mailer;