require("dotenv").config();
const bodyparser = require("body-parser");
const razorpay = require("./config/razorpay");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const resumeRoute = require("./Routes/resume");

const otpRouter = require("./Routes/otp");
const loginHistoryRoute = require("./Routes/loginhistory");
const subscriptionRoutes = require("./Routes/subscription");
const port = 5000;
const path = require("path");


app.use(cors({
  origin:true,
  credentials: true,
}));
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/subscription", subscriptionRoutes);
app.use("/login-history", loginHistoryRoute);
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api", router);
app.use("/resume", resumeRoute);
app.use("/", otpRouter);


app.get("/", (req, res) => {
  res.send("hello this is internshala backend");
});
connect();

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
app.post("/api/payment/create-order", async (req, res) => {
  try {

    const { amount } = req.body;

    console.log("KEY", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET", process.env.RAZORPAY_KEY_SECRET);
    console.log("AMOUNT", amount);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    // THIS LINE IS IMPORTANT
    const order = await razorpay.orders.create(options);

    console.log(order);

    res.json(order);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Order creation failed",
    });
  }
});