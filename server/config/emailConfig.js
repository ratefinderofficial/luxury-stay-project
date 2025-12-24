const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT, // 587 or 465
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Admin email
    pass: process.env.EMAIL_PASS  // App password
  }
});

// Connection Verify karna (Server start hone par check karega)
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email Server Error:', error);
  } else {
    console.log('✅ Email Server is Ready to send messages');
  }
});

module.exports = transporter;