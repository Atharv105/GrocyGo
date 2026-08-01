const orderService = require("./services/orderService");

async function checkService() {
  try {
    const data = await orderService.getAllOrders({ limit: 1000 });
    console.log("Keys returned by getAllOrders:", Object.keys(data));
    console.log("totalOrders:", data.totalOrders);
    console.log("Orders count in array:", data.orders.length);
    console.log("First order keys:", Object.keys(data.orders[0].toJSON()));
    console.log("First order data:", JSON.stringify(data.orders[0].toJSON(), null, 2));
  } catch (error) {
    console.error("Error running service test:", error);
  } finally {
    process.exit(0);
  }
}

checkService();
