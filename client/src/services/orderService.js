import API from "./api";

/** Place order from current user's cart */
export const checkout = () =>
  API.post("/orders/checkout").then((r) => r.data);

/** Get logged in user's orders */
export const getMyOrders = () =>
  API.get("/orders/my-orders").then((r) => r.data);

/** Get order details by ID */
export const getOrderById = (orderId) =>
  API.get(`/orders/${orderId}`).then((r) => r.data);

/** Cancel a pending order */
export const cancelOrder = (orderId) =>
  API.put(`/orders/${orderId}/cancel`).then((r) => r.data);

/** Admin: Get all orders */
export const getAllOrdersAdmin = () =>
  API.get("/orders/admin/all-orders").then((r) => r.data);

/** Admin: Get details for any order */
export const getOrderByIdAdmin = (orderId) =>
  API.get(`/orders/admin/${orderId}`).then((r) => r.data);

/** Admin: Update order status */
export const updateOrderStatus = (orderId, status) =>
  API.put(`/orders/${orderId}/status`, { status }).then((r) => r.data);

/** Admin: Update order payment status */
export const updateOrderPaymentStatus = (orderId, paymentStatus) =>
  API.put(`/orders/${orderId}/payment`, { paymentStatus }).then((r) => r.data);
