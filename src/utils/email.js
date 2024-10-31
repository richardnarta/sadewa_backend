require('dotenv').config();
const axios = require('axios');

async function sendEmail(recipientEmail, recipientName, subject, content) {
  const apiKey = process.env.BREVO_API_KEY;
  const url = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: 'Sadewa Farm',
    },
    to: [
      {
        email: recipientEmail,
        name: recipientName,
      },
    ],
    subject: subject,
    htmlContent: content,
  };

  try {
    await axios.post(url, emailData, {
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error('Error sending email:', error.response);
    throw error;
  }
}

module.exports = sendEmail;