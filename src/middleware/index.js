const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const config = require("../config");

const setupMiddleware = (app) => {
  // Security headers
  app.use(helmet());
  
  // Enable CORS
  app.use(cors());
  
  // Logging
  app.use(morgan("combined"));
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Session middleware
  app.use(session(config.session));
};

module.exports = { setupMiddleware };
