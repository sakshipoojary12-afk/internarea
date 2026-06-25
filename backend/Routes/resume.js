const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
let otpStore = {};

// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("EMAIL RECEIVED:", email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP GENERATED:", otp);

    otpStore[email] = otp;

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "InternArea",
      },
      to: [{ email }],
      subject: "OTP Verification",
      htmlContent: `<p>Your OTP is <b>${otp}</b></p>`,
    });

    console.log("EMAIL SENT");

    res.json({ success: true });

  } catch (err) {
    console.log("BREVO ERROR:", err);

    res.status(500).json({
      success: false
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

router.post("/generate", async (req, res) => {
  try {
    const { name, email, qualification, experience } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    // 👉 here we simulate resume creation
    const resumeData = {
      name,
      email,
      qualification,
      experience,
      createdAt: new Date(),
    };
    console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

    console.log("Resume Created:", resumeData);

    // 👉 (OPTIONAL) save to DB later
    // await User.updateOne({ email }, { resume: resumeData });

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