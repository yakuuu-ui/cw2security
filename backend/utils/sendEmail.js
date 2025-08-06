// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Validate environment variables
    const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Create a transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_PORT === '465', // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout and connection settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
      // TLS settings for better compatibility
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      }
    });

    // Verify SMTP connection with timeout
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP Server is ready to send emails');

    // Define email options
    const mailOptions = {
      from: `"watchShop" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `<p>Hi ${options.fname || 'User'},</p><p>${options.message.replace(/\n/g, '<br>')}</p>`,
    };

    // Send the email with timeout
    console.log('Sending email to:', options.email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Sending Error Details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your email credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Failed to connect to email server. Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Email server connection timed out. Please try again.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

module.exports = sendEmail;