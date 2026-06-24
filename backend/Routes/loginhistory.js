const express = require("express");
const router = express.Router();
const LoginHistory = require("../Model/loginhistory");

router.post("/", async (req, res) => {
  try {
    const loginData = {
      ...req.body,
      ipAddress: req.socket.remoteAddress,
    };

    console.log("Received login history:", loginData);

    await LoginHistory.create(loginData);

    res.json({
      success: true,
      message: "Saved successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const history = await LoginHistory.find().sort({
      loginTime: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;