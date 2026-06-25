const express = require("express");
const router = express.Router();
const axios = require("axios");

let otpStore = {};


// Login OTP
router.post("/send-login-otp", async (req, res) => {
  console.log("LOGIN OTP HIT");
  console.log("EMAIL:", req.body.email);
  console.log("SENDER:", process.env.EMAIL_USER);

  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "sakshipoojary12@getMaxListeners.com",
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

    console.log("EMAIL SENT");

    res.json({ success: true });
  } catch (err) {
    console.log(
      "BREVO ERROR:",
      err.response?.data || err.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  console.log("VERIFY EMAIL:", email);
  console.log("ENTERED OTP:", otp);
  console.log("STORED OTP:", otpStore[email]);
  console.log("FULL OTP STORE:", otpStore);

  if (String(otpStore[email]) === String(otp)) {
    delete otpStore[email];

    console.log("OTP VERIFIED SUCCESSFULLY");

    return res.json({
      success: true,
    });
  }

  console.log("OTP VERIFICATION FAILED");

  return res.json({
    success: false,
    message: "Invalid OTP",
  });
});

module.exports = router;