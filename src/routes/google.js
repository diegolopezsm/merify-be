const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const url = require("url");
const GoogleAuthService = require("../services/googleAuth");
const config = require("../config");
const googleAuthService = new GoogleAuthService();

// Google OAuth start route
router.get("/auth/start", (req, res) => {
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
    const redirectUrl = `merify-app://auth?google_access_token=${tokens.access_token}&google_refresh_token=${tokens.refresh_token}&expiry_date=${tokens.expiry_date}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).send("Authentication failed");
  }
});

// Google OAuth refresh token route
router.post("/refresh-token", async (req, res) => {
  try {
    const { refresh_token } = req.query;
    if (!refresh_token)
      return res.status(400).json({ error: "missing_refresh_token" });

    const params = new URLSearchParams({
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      refresh_token: refresh_token,
      grant_type: "refresh_token", // <- obligatorio
    });

    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await r.json();
    if (!r.ok) {
      // data puede contener { error, error_description }
      console.warn("Google token endpoint responded non-OK", r.status, data);
      // si error === 'invalid_grant' normalmente el refresh token está revocado/incorrecto/o no corresponde al client
      return res.status(400).json({ status: r.status, ...data });
    }

    // OK: data tiene access_token, expires_in, token_type, scope (NO refresh_token normalmente)
    return res.json(data);
  } catch (err) {
    console.error("Error refresh token:", err);
    return res
      .status(500)
      .json({ error: "server_error", message: String(err) });
  }
});

module.exports = router;
