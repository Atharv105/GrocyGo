const orderService = require("../services/orderService");

const checkout = async (req, res, next) => {
  try {
    const { slotId } = req.body;

    const order = await orderService.checkout(
      req.user.id,
      slotId
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);

    res.status(200).json({
      success: true,
      message: "My orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrdersAdmin();

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderByIdAdmin = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByIdAdmin(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatusAdmin(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderPaymentStatusAdmin(
      req.params.id,
      req.body.paymentStatus
    );

    res.status(200).json({
      success: true,
      message: "Order payment status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatus,
  updateOrderPaymentStatus,
};