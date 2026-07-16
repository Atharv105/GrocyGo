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
  const category = await Category.findByPk(id);

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

  // Propagate isActive status changes to all associated products
  if (categoryData.isActive !== undefined) {
    const newStatus = categoryData.isActive === true || categoryData.isActive === "true";
    await Product.update(
      { isActive: newStatus },
      {
        where: {
          categoryId: id,
        },
      }
    );
  }

  return category;
};

// Soft Delete Category
const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await category.update({
    isActive: false,
  });

  // Automatically deactivate all products in this category
  await Product.update(
    { isActive: false },
    {
      where: {
        categoryId: id,
      },
    }
  );
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};