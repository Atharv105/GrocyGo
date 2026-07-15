const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { createSlot , getAllSlots, generateSlots, getAvailableSlots, updateSlot} = require("../controllers/slotController");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createSlot
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllSlots
);

router.post(
  "/generate",
  authMiddleware,
  adminMiddleware,
  generateSlots
);

router.get(
  "/available",
  authMiddleware,
  getAvailableSlots
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateSlot
);

module.exports = router;