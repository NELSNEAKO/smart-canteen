const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: proccess.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

module.exports = transporter;
