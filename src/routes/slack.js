const express = require("express");
const router = express.Router();
const SlackAuthService = require("../services/slackAuth");

const slackAuthService = new SlackAuthService();

// Slack OAuth callback route
router.use("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const data = await slackAuthService.exchangeCodeForToken(code);
    const redirectUrl = slackAuthService.generateRedirectUrl(data.access_token);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Slack auth error:", error);
    return res.status(500).send("Authentication failed");
  }
});

module.exports = router;
