const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided."
      });
    }

    const token = authHeader.split(" ")[1];

    // Remove "Bearer " from token
    const actualToken = token.replace("Bearer ", "");

    // Verify Token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Save user data in request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = authMiddleware;