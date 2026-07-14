const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatus,
  updateOrderPaymentStatus,
} = require("../controllers/orderController");

// Admin Routes (Placed above user parameters routes to prevent matching collision)
router.get("/admin/all-orders", authMiddleware, adminMiddleware, getAllOrdersAdmin);
router.get("/admin/:id", authMiddleware, adminMiddleware, getOrderByIdAdmin);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put("/:id/payment", authMiddleware, adminMiddleware, updateOrderPaymentStatus);

// User Routes
router.post("/checkout", authMiddleware, checkout);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;