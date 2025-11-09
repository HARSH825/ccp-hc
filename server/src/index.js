
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import statementRoutes from "./routes/statementRoutes.js";
import startKeepAlive from "../keepAlive.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api", statementRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Credit Card Statement Parser API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      parseStatement: "POST /api/parse-statement",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File size too large. Maximum size is 10MB.",
    });
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {

  console.log(`Server running on: http://localhost:${PORT}`);
  // Start keep-alive service for Render (only in production)
  if (process.env.NODE_ENV === "production" && process.env.RENDER_URL) {
    startKeepAlive();
  }
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT signal received: closing HTTP server");
  process.exit(0);
});
