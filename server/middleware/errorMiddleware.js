
const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
    logger.error(`${err.message || "Internal Server Error"} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`, {
        stack: err.stack,
    });

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        error: err.message,
        data : null,
    });
};

module.exports = errorMiddleware;