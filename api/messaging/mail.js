const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const path = require('path');

const hbs = require('nodemailer-express-handlebars')({ viewEngine: exphbs.create({ extname: ".hbs", defaultLayout:path.join(__dirname, '/templates/default') }), viewPath: path.join(__dirname, '/templates'), extName:".hbs"});

const frontendUrl = process.env.FRONTEND_URL

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.use('compile', hbs);

const mailOptions = {
    from: `"Chef Bier" ${process.env.MAIL_USER}`,
    subject: 'Uitnodiging',
    template: "default",
    context:{
        logo: `${frontendUrl}/logo.png`,
    }
};

const sendMail = async (options) => {
    return transporter.sendMail({
        ...mailOptions,
        to: options.to,
        subject:options.title,
        context:{
            ...mailOptions.context,
            title: options.title,
            message: options.message,
        }
    })
}

const sendJoinRequest = async (userToJoin, userToRequest, list) => {
    return sendMail({ 
        title: `${userToRequest.username} heeft je uitgenodigd voor een lijst`,
        to: userToJoin.email,
        message: /*html*/`Je bent uitgenodigd om deel te nemen aan de lijst: <span style="font-weight: bold;color: #285a84;">${list.name}</span>. Klik <a href="${frontendUrl}/join/${list.shareId}">hier</a> om mee te doen aan de lijst.`
    })
}

module.exports.sendJoinRequest = sendJoinRequest;