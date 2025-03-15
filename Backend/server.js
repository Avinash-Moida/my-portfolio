const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["https://myportfolio-frontend-gamma.vercel.app"], // Replace with your actual frontend domain
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // Parses JSON data

// ✅ Root Route (To Check if Backend is Running)
app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// ✅ Contact API Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

// ✅ Start Server for Local Testing (Vercel Doesn't Need This)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Export the App for Vercel Deployment
module.exports = app;
