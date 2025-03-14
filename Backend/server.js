const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["https://myportfolio-frontend-gamma.vercel.app"], // Ensure this is correct
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // Parses JSON data

// ✅ Check for missing environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    "❌ Missing EMAIL_USER or EMAIL_PASS in environment variables."
  );
}

// ✅ Verify Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Nodemailer Transport Error:", error);
  } else {
    console.log("✅ Nodemailer is ready to send emails");
  }
});

// ✅ Root Route for Testing
app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// ✅ Contact Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Your email
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: error.message || "Failed to send message" });
  }
});

// ✅ Required for Vercel (Export the app)
module.exports = app;
