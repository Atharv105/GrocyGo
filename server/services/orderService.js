<<<<<<< HEAD
<<<<<<< HEAD
const { sequelize, Cart, CartItem, Product, Order, OrderItem, User } = require("../models");
=======
=======
>>>>>>> a89405d1815ccd01b892c1162b749a17b4d01e1e
const {
  sequelize,
  User,
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
  Slot,
} = require("../models");
<<<<<<< HEAD
>>>>>>> 1d55b7275f3ec53e208241c56e1f27bb584a5d40
=======
>>>>>>> a89405d1815ccd01b892c1162b749a17b4d01e1e
const AppError = require("../utils/AppError");


const checkout = async (userId, slotId, paymentMethod = "CASH") => {
  // Start transaction
  const transaction = await sequelize.transaction();


  try {

    if (!slotId) {
      throw new AppError("Slot is required", 400);
    }

    if (paymentMethod !== "CASH") {
      throw new AppError(
        "Only Cash On Pickup is available",
        400
      );
    }

    const slot = await Slot.findOne({
      where: {
        id: slotId,
        isActive: true,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!slot) {
      throw new AppError("Invalid slot selected", 404);
    }

    const today = new Date().toISOString().split("T")[0];

    if (slot.date < today) {
      throw new AppError("Selected slot has expired", 400);
    }

    if (slot.bookedCount >= slot.maxCapacity) {
      throw new AppError("Selected slot is full", 400);
    }

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
        slotId,
        totalAmount,
        paymentMethod,
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
      await Product.decrement("stock", {
        by: item.quantity,
        where: {
          id: item.productId,
        },
        transaction,
      });
    }
    console.log("Product stock updated.");

    // Update Slot bookedCount
    await slot.increment("bookedCount", {
      by: 1,
      transaction,
    });

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
    include: [
      {
        model: Slot,
        attributes: ["date", "startTime", "endTime"],
      },
    ],
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
        model: Slot,
        attributes: [
          "date",
          "startTime",
          "endTime"
        ]
      },

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
        await Product.increment("stock", {
          by: item.quantity,
          where: {
            id: item.productId,
          },
          transaction,
        });
      }
    }

    // Update Slot bookedCount
    const slot = await Slot.findByPk(order.slotId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (slot && slot.bookedCount > 0) {
      await slot.decrement("bookedCount", {
        by: 1,
        transaction,
      });
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


const getAllOrders = async () => {
  const orders = await Order.findAll({
    attributes: [
      "id",
      "totalAmount",
      "status",
      "paymentStatus",
      "createdAt",
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "phone"],
      },
      {
        model: Slot,
        attributes: ["date", "startTime", "endTime"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
};

const getAdminOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    attributes: [
      "id",
      "totalAmount",
      "status",
      "paymentStatus",
      "createdAt",
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "mobile"],
      },
      {
        model: Slot,
        attributes: ["date", "startTime", "endTime"],
      },
      {
        model: OrderItem,
        attributes: [
          "id",
          "quantity",
          "price",
          "subtotal",
        ],
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

const updateOrderStatus = async (orderId, status) => {
  const validStatuses = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
  ];

  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid order status", 400);
  }

  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Prevent updates after completion/cancellation
  if (order.status === "COMPLETED") {
    throw new AppError(
      "Completed orders cannot be updated",
      400
    );
  }

  if (order.status === "CANCELLED") {
    throw new AppError(
      "Cancelled orders cannot be updated",
      400
    );
  }

  // Allowed transitions
  if (
    order.status === "PENDING" &&
    status !== "CONFIRMED"
  ) {
    throw new AppError(
      "Pending orders can only be confirmed",
      400
    );
  }

  if (
    order.status === "CONFIRMED" &&
    status !== "COMPLETED"
  ) {
    throw new AppError(
      "Confirmed orders can only be completed",
      400
    );
  }

  order.status = status;

  await order.save();

  return order;
};

const updatePaymentStatus = async (orderId) => {

  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status !== "CONFIRMED") {
    throw new AppError(
      "Payment can only be marked after the order is confirmed",
      400
    );
  }

  order.paymentStatus = "PAID";

  await order.save();

  return order;
}


module.exports = {
<<<<<<< HEAD
<<<<<<< HEAD
    checkout,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin,
    updateOrderPaymentStatusAdmin,
=======
=======
>>>>>>> a89405d1815ccd01b892c1162b749a17b4d01e1e
  checkout,
  getMyOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
};