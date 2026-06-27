const express = require('express');
const router = express.Router();

const { register, login, profile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Profile Route
router.get("/profile", authMiddleware, profile);

router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
    res.json({ success: true, message: "Welcome, Admin!" });
});

module.exports = router;