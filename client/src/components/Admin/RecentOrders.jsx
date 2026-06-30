import { FaEye } from "react-icons/fa";

function RecentOrders() {
  const orders = [
    {
      id: "#ORD1001",
      customer: "Rushikesh",
      amount: "₹560",
      slot: "10:00 AM",
      status: "Ready",
    },
    {
      id: "#ORD1002",
      customer: "Rahul",
      amount: "₹820",
      slot: "11:00 AM",
      status: "Preparing",
    },
    {
      id: "#ORD1003",
      customer: "Sneha",
      amount: "₹430",
      slot: "12:30 PM",
      status: "Collected",
    },
    {
      id: "#ORD1004",
      customer: "Amit",
      amount: "₹290",
      slot: "02:00 PM",
      status: "Pending",
    },
    {
      id: "#ORD1005",
      customer: "Priya",
      amount: "₹670",
      slot: "04:00 PM",
      status: "Ready",
    },
  ];

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",
    Preparing: "bg-blue-100 text-blue-700",
    Ready: "bg-green-100 text-green-700",
    Collected: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Orders</h2>

        <button className="text-green-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Pickup Slot</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 font-medium">{order.id}</td>

                <td>{order.customer}</td>

                <td>{order.amount}</td>

                <td>{order.slot}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusColor[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <button className="text-green-600 hover:text-green-800">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
