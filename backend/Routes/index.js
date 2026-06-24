const express = require("express");
const router = express.Router();

const admin = require("./admin");
const intern = require("./internship");
const job = require("./job");
const application = require("./application");
const post = require("./post");
const subscriptionRoute = require("./subscription");

// 🔥 ACTUAL ROUTE MOUNTING (THIS WAS MISSING)

router.use("/admin", admin);
router.use("/internship", intern);
router.use("/job", job);
router.use("/application", application);
router.use("/post", post);
router.use("/subscription", subscriptionRoute);

module.exports = router;