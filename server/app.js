const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const logger = require("./utils/logger");
const { generalLimiter } = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const slotRoutes = require("./routes/slotRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Trust Proxy (Required for Render / Reverse Proxy)
app.set("trust proxy", 1);

// Security Middleware
app.use(helmet());

// Compress Response
app.use(compression());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// HTTP Request Logging (Morgan streamed to Winston)
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(
  morgan(
    process.env.NODE_ENV === "production" ? "combined" : "dev",
    { stream: morganStream }
  )
);

// Cookie Parser
app.use(cookieParser());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route (Useful for Deployment)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GrocyGo Backend Running Successfully 🚀",
  });
});

// Apply General Rate Limiter to all API routes
app.use("/api", generalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/slots", slotRoutes);

// Global Error Handler (Always Last)
app.use(errorMiddleware);

module.exports = app;