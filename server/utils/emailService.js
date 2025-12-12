const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const sendEmail = async (to, subject, templateName, context) => {
    try {
        // Agar credentials nahi hain to wapas jao
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("⚠️ Email Service: Skipping email (Missing Credentials)");
            return;
        }

        // 1. Transporter Setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        // 2. Handlebars Setup
        const handlebarOptions = {
            viewEngine: {
                extName: '.hbs',
                partialsDir: path.resolve('./templates/emails/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./templates/emails/'),
            extName: '.hbs',
        };

        transporter.use('compile', hbs(handlebarOptions));

        // 3. Send Mail
        const mailOptions = {
            from: `"LuxuryStay" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            template: templateName, 
            context, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully: ${info.messageId}`);
        
    } catch (error) {
        // Error throw mat karo, bas log karo taaki registration na ruke
        console.error(`❌ Email Service Error: ${error.message}`);
    }
};

module.exports = sendEmail;