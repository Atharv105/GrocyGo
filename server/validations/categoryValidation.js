const { body } = require("express-validator");

const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 50 })
    .withMessage("Category name cannot exceed 50 characters"),
];

const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty if provided")
    .isLength({ max: 50 })
    .withMessage("Category name cannot exceed 50 characters"),
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
