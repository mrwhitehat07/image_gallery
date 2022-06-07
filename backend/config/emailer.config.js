const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'trynshop@gmail.com',
        pass: 'Node@123',
    },
});

module.exports = transporter;