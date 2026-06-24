const express = require("express");
const router = express.Router();

const Razorpay = require("razorpay");

const Subscription = require("../Model/subscription");
const Payment = require("../Model/Payment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.get("/test", (req, res) => {
  res.send("Subscription route working");
});

router.post("/subscribe", async (req, res) => {
  try {
   const { userEmail, plan, userId } = req.body;

    // IST Time Check
    const indiaTime = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    //const hour = indiaTime.getHours();

    //if (hour < 10 || hour >= 11) {
      //return res.status(400).json({
       // message:
          //"Payments are allowed only between 10:00 AM and 11:00 AM IST",
      //});
   // }

    // Amount
    let amount = 0;

    if (plan === "BRONZE") amount = 100;
    if (plan === "SILVER") amount = 300;
    if (plan === "GOLD") amount = 1000;

    // Application Limits
    let limit = 1;

    if (plan === "BRONZE") limit = 3;
    if (plan === "SILVER") limit = 5;
    if (plan === "GOLD") limit = 999999; // Unlimited

    // Subscription
    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        plan,
        subscriptionLimit: limit,
        subscriptionDate: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    // Payment
    const payment = new Payment({
  userEmail,
  plan,
  amount,
  paymentId: "TEMP_" + Date.now(),
});

    await payment.save();

    res.status(200).json({
      message: "Subscription activated",
      subscription,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/create-order", async (req, res) => {
  try {
    const { plan } = req.body;

    let amount = 0;

    if (plan === "BRONZE") amount = 100;
    if (plan === "SILVER") amount = 300;
    if (plan === "GOLD") amount = 1000;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;