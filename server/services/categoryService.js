const { Category } = require('../models');

const createCategory = async (categoryData) => {
    // Check if category already exists
    const existingCategory = await Category.findOne({
        where: {
            name: categoryData.name,
        },
    });

    if (existingCategory) {
        throw new Error('Category already exists');
    }

    //create new category
    const category = await Category.create(categoryData);
    return category;
};

const getAllCategories = async () => {
    const categories = await Category.findAll({
        order: [["createdAt", "DESC"]],
    });
    return categories;
};

const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (id, categoryData) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error("Category not found");
  }

  // Check if another category already has the same name
  if (categoryData.name) {
    const existingCategory = await Category.findOne({
      where: {
        name: categoryData.name,
      },
    });

    if (existingCategory && existingCategory.id !== category.id) {
      throw new Error("Category name already exists");
    }
  }

  await category.update(categoryData);

  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error("Category not found");
  }

  await category.destroy();

  return;
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};

