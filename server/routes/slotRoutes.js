const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { createSlot , getAllSlots, generateSlots, getAvailableSlots, updateSlot} = require("../controllers/slotController");

const { createSlotValidation, generateSlotsValidation } = require("../validations/slotValidation");
const validationMiddleware = require("../middleware/validationMiddleware");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createSlotValidation,
  validationMiddleware,
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
  generateSlotsValidation,
  validationMiddleware,
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
  createSlotValidation, // Reuse slot payload schema
  validationMiddleware,
  updateSlot
);

module.exports = router;