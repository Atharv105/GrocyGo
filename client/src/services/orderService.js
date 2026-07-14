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
