const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { checkout,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    getAdminOrderById,
    updateOrderStatus,
    updatePaymentStatus
} = require("../controllers/orderController");

// CUSTOMER ROUTES
router.post("/checkout", authMiddleware, checkout);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// ADMIN ROUTES
router.get(
    "/admin/orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

router.get(
    "/admin/orders/:id",
    authMiddleware,
    adminMiddleware,
    getAdminOrderById
);

router.patch(
  "/admin/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.patch(
  "/admin/orders/:id/payment-status",
  authMiddleware,
  adminMiddleware,
  updatePaymentStatus
);

module.exports = router;