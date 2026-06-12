const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "https://s-gokuleswaran.github.io",
  methods: ["GET", "POST"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
      }
    });

    console.log("Attempting to send mail...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `📩 New Portfolio Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">
          <div style="background:#0f172a; color:white; padding:20px;">
            <h2 style="margin:0;">New Portfolio Contact Request</h2>
          </div>

          <div style="padding:20px;">
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding:10px; font-weight:bold; width:120px;">Name</td>
                <td style="padding:10px;">${name}</td>
              </tr>

              <tr style="background:#f8fafc;">
                <td style="padding:10px; font-weight:bold;">Email</td>
                <td style="padding:10px;">${email}</td>
              </tr>

              <tr>
                <td style="padding:10px; font-weight:bold;">Message</td>
                <td style="padding:10px;">${message}</td>
              </tr>
            </table>

            <hr style="margin:20px 0;">

            <p style="color:#666; font-size:14px;">
              This message was submitted through your portfolio website contact form.
            </p>
          </div>
        </div>
      `
    });

    console.log("Mail sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    });

  } catch (error) {
    console.error("MAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});