"use strict";

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = ( email, name ) => 
{
    return

    sgMail.send({
        to: email,
        from: 'thedimbar@gmail.com',
        subject: 'this is my first creation!',
        text: `Hi ${name}, welcome to your home page.`
    })
}

const sendCancelEmail = ( email, name ) => 
{

    return
    
    sgMail.send({
        to: email,
        from: 'thedimbar@gmail.com',
        subject: 'Cancel email',
        text: `thanks for using our account ${name}, goodbye.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
