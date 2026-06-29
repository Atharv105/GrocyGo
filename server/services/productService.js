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
            name: productData.name,
            categoryId: productData.categoryId,
        },
    });

    if (existingProduct) {
        throw new Error("Product already exists in this category");
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

  const where = {
    isActive: true,
  };

  // Search by product name
  if (search) {
    where.name = {
      [Op.like]: `%${search}%`,
    };
  }

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
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
        attributes: ["id", "name"],
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
        where : {
            id,
            isActive : true,
        },
        include : [
            {
                model: Category,
                attributes: ["id","name"],
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

  if (!product || !product.isActive) {
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
  if (productData.name) {
    const existingProduct = await Product.findOne({
      where: {
        name: productData.name,
        categoryId: productData.categoryId || product.categoryId,
      },
    });

    if (existingProduct && existingProduct.id !== product.id) {
      throw new AppError(
        "Product already exists in this category",
        400
      );
    }
  }

  await product.update(productData);

  return product;
};

const deleteProduct = async(id) => {
    const product = await Product.findByPk(id);

    if(!product || !product.isActive){
        throw new AppError("Product not found",404);
    }
    await product.update({
        isActive : false,
    });
    return;
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
