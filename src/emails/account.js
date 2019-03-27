"use strict";

const sgMail = require('@sendgrid/mail')
const { sendOutEmails,  SENDGRID_API_KEY } = require('../env/env')


sgMail.setApiKey(SENDGRID_API_KEY)

const sendWelcomeEmail = ( email, name ) => 
{
    if (sendOutEmails === 'NO') return

    sgMail.send({
        to: email,
        from: 'thedimbar@gmail.com',
        subject: 'this is my first creation!',
        text: `Hi ${name}, welcome to your home page.`
    })
}

const sendCancelEmail = ( email, name ) => 
{

    if (sendOutEmails === 'NO') return
    
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
