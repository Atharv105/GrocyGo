const { where } = require("sequelize");
const { Product, Cart, CartItem } = require("../models");
const AppError = require("../utils/AppError");


const addToCart = async (userId, productId, quantity) => {
    //Check product exists
    const product = await Product.findOne({
        where: {
            id: productId,
            isActive: true,
        },
    });

    if (!product) {
        throw new AppError("Product not Found", 404);
    }

    //check stock

    if (product.stock < quantity) {
        throw new AppError("Insufficient stock", 400);
    }

    //Find user's cart
    let cart = await Cart.findOne({
        where: { userId },
    });

    // Create cart if not exists
    if (!cart) {
        cart = await Cart.create({
            userId,
        });
    }

    // Check if product already exists in cart
    const existingItem = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
            throw new AppError(
                `Only ${product.stock} item(s) available in stock`,
                400
            );
        }

        existingItem.quantity = newQuantity;
        await existingItem.save();

        return existingItem;
    }

    const cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
    });

    return cartItem;
};

const getMyCart = async (userId) => {
    const cart = await Cart.findOne({
        where: { userId },
        include: [
            {
                model: CartItem,
                include: [
                    {
                        model: Product,
                        attributes: [
                            "id",
                            "name",
                            "price",
                            "stock",
                            "unit",
                            "image",
                            "isActive",
                        ],
                    },
                ],
            },
        ],
    });

    if (!cart) {
        return {
            cartId: null,
            totalItems: 0,
            grandTotal: 0,
            items: [],
        };
    }

    let grandTotal = 0;
    let totalItems = 0;

    const items = cart.CartItems
        .filter((item) => item.Product && item.Product.isActive)
        .map((item) => {
            const subtotal = Number(item.Product.price) * item.quantity;
            grandTotal += subtotal;
            totalItems += item.quantity;

            return {
                id: item.id,
                productId: item.Product.id,
                name: item.Product.name,
                image: item.Product.image,
                unit: item.Product.unit,
                price: item.Product.price,
                stock: item.Product.stock,
                quantity: item.quantity,
                subtotal,
            };
        });

    return {
        cartId: cart.id,
        totalItems,
        grandTotal,
        items,
    };
};

const updateCartQuantity = async (userId, productId, quantity) => {
    if (quantity < 1) {
        throw new AppError("Quantity must be at least 1", 400);
    }

    const cart = await Cart.findOne({
        where: { userId },
    });

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }
    // Find cart item
    const cartItem = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId,
        },
        include: [
            {
                model: Product,
            },
        ],
    });

    if (!cartItem) {
        throw new AppError("Product not found in cart", 404);
    }

    if (!cartItem.Product.isActive) {
        throw new AppError("Product is no longer available", 400);
    }

    if (quantity > cartItem.Product.stock) {
        throw new AppError(
            `Only ${cartItem.Product.stock} item(s) available in stock`,
            400
        );
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    return cartItem;

};

const removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({
        where: { userId },
    });

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    const cartItem = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    if (!cartItem) {
        throw new AppError("Product not found in cart", 404);
    }

    await cartItem.destroy();

    return ;
};

const clearCart = async (userId) => {
  // Find user's cart
  const cart = await Cart.findOne({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // Delete all cart items
  await CartItem.destroy({
    where: {
      cartId: cart.id,
    },
  });

  return;
};



module.exports = {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
}   