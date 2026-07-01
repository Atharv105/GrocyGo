import { FaClipboardList } from "react-icons/fa";

function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 mt-2">View and manage all customer orders.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
          <FaClipboardList size={36} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Order Management</h2>
        <p className="text-gray-400 mt-2 max-w-md">
          Once customers start placing orders, they will appear here. You will be
          able to update order status, assign pickup slots, and manage fulfilment.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Order management coming soon
        </span>
      </div>
    </div>
  );
}

export default Orders;
