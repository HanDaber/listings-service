var nodemailer = require("nodemailer");

function Mailer ( email ) {
    // create reusable transport method (opens pool of SMTP connections) // TODO: secure credentials in db
    var smtpTransport = nodemailer.createTransport("SMTP",                                                                                                                                                                                                          {service:"Gmail",auth:{user:'handaber@gmail.com',pass:'!6infuckinsaniuM9'}});

    return function( body ) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: "listing-mailer", // sender address
            to: email, // list of receivers
            subject: "latest scrape results", // Subject line
            text: "Hello", // plaintext body
            html: "<b>"+body+"</b>" // html body
        };

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
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