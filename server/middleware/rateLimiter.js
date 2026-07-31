const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

// General rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`General Rate limit exceeded - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

// Strict rate limiter for OTP endpoints: 5 requests per 5 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests from this IP, please try again after 5 minutes.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`OTP Rate limit exceeded - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

module.exports = {
  generalLimiter,
  otpLimiter,
};
