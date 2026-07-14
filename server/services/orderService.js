const { sequelize, Cart, CartItem, Product, Order, OrderItem, User } = require("../models");
const AppError = require("../utils/AppError");


const checkout = async (userId) => {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
        // Find user's cart with products
        const cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
            transaction,
        });

        // Check if cart exists
        if (!cart) {
            throw new AppError("Cart is empty", 400);
        }

        // Check if cart has items
        if (cart.CartItems.length === 0) {
            throw new AppError("Cart is empty", 400);
        }
        console.log("Cart found successfully.");

        let totalAmount = 0;

        // Validate every product
        for (const item of cart.CartItems) {
            const product = item.Product;

            // Product deleted or inactive
            if (!product || !product.isActive) {
                throw new AppError(
                    `Product "${product?.name || "Unknown"}" is unavailable`,
                    400
                );
            }

            // Stock validation
            if (item.quantity > product.stock) {
                throw new AppError(
                    `Only ${product.stock} item(s) of "${product.name}" available`,
                    400
                );
            }

            // Calculate total amount
            totalAmount += Number(product.price) * item.quantity;
        }
        console.log("Stock validation successful.");
        console.log("Total Amount:", totalAmount);

        // Create Order
        const order = await Order.create(
            {
                userId,
                totalAmount,
                status: "PENDING",
                paymentStatus: "PENDING",
            },
            {
                transaction,
            }
        );
        console.log("Order created:", order.id);

        // Create Order Items
        for (const item of cart.CartItems) {
            await OrderItem.create(
                {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.Product.price,
                    subtotal: Number(item.Product.price) * item.quantity,
                },
                {
                    transaction,
                }
            );
        }
        console.log("Order items created successfully.");

        // Reduce Product Stock
        for (const item of cart.CartItems) {
            await Product.update(
                {
                    stock: item.Product.stock - item.quantity,
                },
                {
                    where: {
                        id: item.productId,
                    },
                    transaction,
                }
            );
        }
        console.log("Product stock updated.");

        // Clear Cart
        await CartItem.destroy({
            where: {
                cartId: cart.id,
            },
            transaction,
        });
        console.log("Cart cleared.");

        // Commit transaction
        await transaction.commit();
        console.log("Transaction committed successfully.");

        return order;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


const getMyOrders = async (userId) => {
  const orders = await Order.findAll({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
  });

  return orders;
};


const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    where: {
      id: orderId,
      userId,
    },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "name",
              "image",
              "unit",
            ],
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};


const cancelOrder = async (userId, orderId) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: OrderItem,
        },
      ],
      transaction,
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status === "CANCELLED") {
      throw new AppError("Order is already cancelled", 400);
    }

    if (order.status !== "PENDING") {
      throw new AppError(
        "Only pending orders can be cancelled",
        400
      );
    }

    // Restore stock
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.productId, {
        transaction,
      });

      if (product) {
        product.stock += item.quantity;
        await product.save({ transaction });
      }
    }

    // Update order status
    order.status = "CANCELLED";
    await order.save({ transaction });

    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


const getAllOrdersAdmin = async () => {
  const orders = await Order.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name", "mobile"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
};

const getOrderByIdAdmin = async (orderId) => {
  const order = await Order.findOne({
    where: {
      id: orderId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "mobile"],
      },
      {
        model: OrderItem,
        include: [
          {
            model: Product,
            attributes: ["id", "name", "image", "unit", "price"],
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

const updateOrderStatusAdmin = async (orderId, status) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
        },
      ],
      transaction,
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid order status", 400);
    }

    // Handle stock restoration if order is cancelled
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId, {
          transaction,
        });

        if (product) {
          product.stock += item.quantity;
          await product.save({ transaction });
        }
      }
    }

    // Handle stock re-deduction if status goes back to active from cancelled
    if (order.status === "CANCELLED" && status !== "CANCELLED") {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId, {
          transaction,
        });

        if (product) {
          if (product.stock < item.quantity) {
            throw new AppError(`Insufficient stock for "${product.name}" to reactivate order`, 400);
          }
          product.stock -= item.quantity;
          await product.save({ transaction });
        }
      }
    }

    order.status = status;
    await order.save({ transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOrderPaymentStatusAdmin = async (orderId, paymentStatus) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const validPaymentStatuses = ["PENDING", "PAID", "FAILED"];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new AppError("Invalid payment status", 400);
  }

  order.paymentStatus = paymentStatus;
  await order.save();

  return order;
};


module.exports = {
    checkout,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin,
    updateOrderPaymentStatusAdmin,
};