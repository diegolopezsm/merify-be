const express = require("express");
const router = express.Router();

// Basic route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Merify Backend API",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
