const express = require("express");

const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Create Category
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createCategory
);

// Get All Categories
router.get("/", getAllCategories);

// Get Category by ID
router.get("/:id", getCategoryById);

// Update Category
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateCategory
);

// Delete Category
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);

module.exports = router;