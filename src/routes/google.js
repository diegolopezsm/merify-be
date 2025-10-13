const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const url = require("url");
const GoogleAuthService = require("../services/googleAuth");

const googleAuthService = new GoogleAuthService();

// Google OAuth start route
router.get("/auth/start", (req, res) => {
  console.log("Starting Google OAuth");
  
  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;
  const authUrl = googleAuthService.generateAuthUrl(state);
  res.redirect(authUrl);
});

// Google OAuth callback route
router.get("/callback", async (req, res) => {
  let q = url.parse(req.url, true).query;

  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
    res.end("Error:" + q.error);
    return;
  }
  // if (q.state !== req.session.state) {
  //   //check state value
  //   console.log("State mismatch. Possible CSRF attack");
  //   res.end("State mismatch. Possible CSRF attack");
  //   return;
  // }

  if (!q.code) {
    return res.status(400).send("No code provided");
  }

  try {
    const { tokens } = await googleAuthService.getToken(q.code);
    const redirectUrl = `merify-app://auth?google_access_token=${tokens.access_token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;
