const { body } = require("express-validator");

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  body("unit")
    .notEmpty()
    .withMessage("Unit is required"),

  body("categoryId")
    .isInt()
    .withMessage("Valid categoryId is required"),
];

module.exports = {
  createProductValidation,
};