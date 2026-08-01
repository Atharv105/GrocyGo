const {Product , Category} = require("../models");
const AppError = require("../utils/AppError");
const {Op} = require("sequelize");

const createProduct = async (productData) => {
    // Check if category exists
    const category = await Category.findByPk(productData.categoryId);
    if (!category) {
        throw new Error("Category not found");
    }
    // check duplicate product in the same category
    const existingProduct = await Product.findOne({
        where: {
            [Op.or]: [
                { name_en: productData.name_en },
                { name_mr: productData.name_mr }
            ],
            categoryId: productData.categoryId,
        },
    });

    if (existingProduct) {
        throw new Error("Product already exists in this category with the same English or Marathi name");
    }

    // Create new product
    const product = await Product.create(productData);
    return product;
};


const getAllProducts = async (query) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "DESC",
  } = query;

  const where = {};
  if (query.includeInactive === "true") {
    // Show all including inactive
  } else {
    where.isActive = true;
  }

  // Search by product name
  if (search) {
    where[Op.or] = [
      { name_en: { [Op.like]: `%${search}%` } },
      { name_mr: { [Op.like]: `%${search}%` } }
    ];
  }

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Filter by stock
  if (query.inStock === "true") {
    where.stock = {
      [Op.gt]: 0,
    };
  }

  // Filter by price
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price[Op.gte] = minPrice;
    }

    if (maxPrice) {
      where.price[Op.lte] = maxPrice;
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        attributes: ["id", "name_en", "name_mr"],
      },
    ],
    order: [[sort, order]],
    limit: Number(limit),
    offset: Number(offset),
  });

  return {
    totalProducts: count,
    currentPage: Number(page),
    totalPages: Math.ceil(count / limit),
    products: rows,
  };
};

const getProductById = async(id) => {
    const product = await Product.findByPk(id,{
        include : [
            {
                model: Category,
                attributes: ["id", "name_en", "name_mr"],
            },
        ],
    });

    if(!product){
        throw new AppError("Product not Found",404);
    }
    return product;
};

const updateProduct = async (id, productData) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if category exists
  if (productData.categoryId) {
    const category = await Category.findByPk(productData.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  // Check duplicate name in the same category
  if (productData.name_en || productData.name_mr) {
    const orConditions = [];
    if (productData.name_en) orConditions.push({ name_en: productData.name_en });
    if (productData.name_mr) orConditions.push({ name_mr: productData.name_mr });

    const existingProduct = await Product.findOne({
      where: {
        [Op.or]: orConditions,
        categoryId: productData.categoryId || product.categoryId,
      },
    });

    if (existingProduct && existingProduct.id !== product.id) {
      throw new AppError(
        "Product already exists in this category with the same English or Marathi name",
        400
      );
    }
  }

  await product.update(productData);

  return product;
};

const deleteProduct = async(id) => {
    const product = await Product.findByPk(id);

    if(!product){
        throw new AppError("Product not found",404);
    }
    try {
        await product.destroy();
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            throw new AppError("Cannot delete product because it has been ordered in customer transactions. Please deactivate it instead.", 400);
        }
        throw error;
    }
    return;
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
