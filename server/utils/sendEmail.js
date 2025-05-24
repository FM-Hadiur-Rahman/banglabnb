// server/utils/email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., banglabnb@gmail.com
    pass: process.env.EMAIL_PASS, // your Google App Password
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"BanglaBnB" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = sendEmail;
