const express = require("express");
const router = express.Router();
const axios = require("axios");

let otpStore = {};

// Login OTP
router.post("/send-login-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_USER,
          name: "InternArea",
        },
        to: [{ email }],
        subject: "Login OTP",
        htmlContent: `<p>Your Login OTP is <b>${otp}</b></p>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Login OTP Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// Verify Login OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  return res.json({ success: false });
});

// Signup OTP
router.post("/send-otp", async (req, res) => {
    console.log("SEND OTP ROUTE HIT");  
  try {
    const { email } = req.body;
        console.log("EMAIL RECEIVED:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_USER,
          name: "InternArea",
        },
        to: [{ email }],
        subject: "OTP Verification",
        htmlContent: `<p>Your OTP is <b>${otp}</b></p>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Signup OTP Error:", err.response?.data || err.message);

    res.status(500).json({
      success: false,
      message: "Email failed",
    });
  }
});

module.exports = router;