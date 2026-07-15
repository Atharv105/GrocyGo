const { Category, Product } = require("../models");
const AppError = require("../utils/AppError");

// Create Category
const createCategory = async (categoryData) => {
  const existingCategory = await Category.findOne({
    where: {
      name: categoryData.name,
      isActive: true,
    },
  });

  if (existingCategory) {
    throw new AppError("Category already exists", 400);
  }

  const category = await Category.create(categoryData);

  return category;
};

// Get All Categories
const getAllCategories = async (query = {}) => {
  const where = {};
  if (query.includeInactive !== "true") {
    where.isActive = true;
  }
  const categories = await Category.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  return categories;
};

// Get Category By ID
const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

// Update Category
const updateCategory = async (id, categoryData) => {
  const category = await Category.findOne({
    where: {
      id,
      isActive: true,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (categoryData.name) {
    const existingCategory = await Category.findOne({
      where: {
        name: categoryData.name,
        isActive: true,
      },
    });

    if (existingCategory && existingCategory.id !== category.id) {
      throw new AppError("Category name already exists", 400);
    }
  }

  await category.update(categoryData);

  return category;
};

// Soft Delete Category
const deleteCategory = async (id) => {
  const category = await Category.findOne({
    where: {
      id,
      isActive: true,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const products = await Product.count({
    where: {
      categoryId: id,
      isActive: true,
    },
  });

  if (products > 0) {
    throw new AppError(
      "Cannot delete category because it contains active products.",
      400
    );
  }

  await category.update({
    isActive: false,
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};