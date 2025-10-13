const express = require("express");
const router = express.Router();

// Import route modules
const indexRoutes = require("./index");
const slackRoutes = require("./slack");
const googleRoutes = require("./google");

// Mount routes
router.use("/", indexRoutes);
router.use("/api/v1/slack", slackRoutes);
router.use("/api/v1/google", googleRoutes);

module.exports = router;
