const express = require("express");
const router = express.Router();
const SibApiV3Sdk = require("@getbrevo/brevo");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);


let otpStore = {};

router.post("/send-login-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = otp;

  await apiInstance.sendTransacEmail({
  sender: {
    email: process.env.SENDER_EMAIL,
    name: "InternArea",
  },
  to: [{ email }],
  subject: "Login OTP",
  htmlContent: `<p>Your Login OTP is <b>${otp}</b></p>`,
});

  res.json({ success: true });
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  return res.json({ success: false });
});
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Email failed" });
  }
});
module.exports = router;