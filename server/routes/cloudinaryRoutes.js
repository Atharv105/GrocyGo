const express = require("express");
const router = express.Router();
const { getCloudinaryImages } = require("../controllers/cloudinaryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Route to get mapped Cloudinary images (admin only)
router.get("/images", authMiddleware, adminMiddleware, getCloudinaryImages);

module.exports = router;
