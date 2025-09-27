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

const sendEmail = async ({ to, subject, body }) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL || "no-reply@cinema.com",
      to,
      subject,
      html: body,
    });
    return response;
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;