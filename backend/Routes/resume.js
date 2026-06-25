const express = require("express");
const router = express.Router();
const axios = require("axios");

let otpStore = {};

// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("EMAIL RECEIVED:", email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP GENERATED:", otp);

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

    console.log("EMAIL SENT");

    res.json({ success: true });
  } catch (err) {
    console.log(
      "BREVO ERROR:",
      err.response?.data || err.message
    );

    res.status(500).json({
      success: false,
    });
  }
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// RESUME GENERATION
router.post("/generate", async (req, res) => {
  try {
    const { name, email, qualification, experience } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Email required",
      });
    }

    const resumeData = {
      name,
      email,
      qualification,
      experience,
      createdAt: new Date(),
    };

    console.log("Resume Created:", resumeData);

    res.json({
      success: true,
      message: "Resume generated successfully",
      resume: resumeData,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;