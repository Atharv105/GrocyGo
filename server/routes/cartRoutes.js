const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addToCart , getMyCart, updateCartQuantity, removeFromCart, clearCart } = require("../controllers/cartController");

const router = express.Router();


router.post("/",authMiddleware,addToCart);
router.get("/",authMiddleware,getMyCart);
router.put("/:productId",authMiddleware,updateCartQuantity);
router.delete("/:productId",authMiddleware,removeFromCart);
router.delete("/",authMiddleware,clearCart);
module.exports = router;