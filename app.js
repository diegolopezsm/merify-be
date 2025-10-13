const express = require("express");
const { setupMiddleware } = require("./src/middleware");
const routes = require("./src/routes/routes");
const config = require("./src/config");

const app = express();

// Setup middleware
setupMiddleware(app);

// Setup routes
app.use("/", routes);

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
      config.nodeEnv === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📍 Health check: http://localhost:${config.port}/health`);
  console.log(`🌐 API base: http://localhost:${config.port}/api`);
});

module.exports = app;
