const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const { google } = require("googleapis");
const crypto = require("crypto");
const url = require("url");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Merify Backend API",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// SLACK
app.use("/api/v1/slack/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  const response = await fetch(`https://slack.com/api/oauth.v2.access`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.SLACK_REDIRECT_URI,
    }),
  });
  const data = await response.json();
  const redirectUrl = `merify-app://auth?slack_access_token=${data.access_token}`;
  return res.redirect(redirectUrl);
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_REDIRECT_URI
);

app.get("/api/v1/google/auth/start", (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    state: state,
    include_granted_scopes: true,
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/calendar.events.readonly",
    ],
  });
  res.redirect(url);
});

app.get("/api/v1/google/callback", async (req, res) => {
  let q = url.parse(req.url, true).query;

  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
    res.end("Error:" + q.error);
    return;
  }
  if (q.state !== req.session.state) {
    //check state value
    console.log("State mismatch. Possible CSRF attack");
    res.end("State mismatch. Possible CSRF attack");
    return;
  }

  if (!q.code) {
    return res.status(400).send("No code provided");
  }

  const { tokens } = await oauth2Client.getToken(q.code);

  const redirectUrl = `merify-app://auth?google_access_token=${tokens.access_token}`;

  res.redirect(redirectUrl);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base: http://localhost:${PORT}/api`);
});

module.exports = app;
