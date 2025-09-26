import nodemailer from "nodemailer";

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (email, subject, message) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject,
    text: message,
  };
  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
};

export default sendEmail;