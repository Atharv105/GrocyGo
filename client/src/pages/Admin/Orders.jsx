import { FaClipboardList } from "react-icons/fa";

function AdminOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-500 mt-2">View and manage all customer orders.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-5">
          <FaClipboardList size={36} className="text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">No Orders Yet</h2>
        <p className="text-gray-400 mt-2 max-w-sm">
          Customer orders will appear here once the ordering system is active.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Order management coming soon
        </span>
      </div>
    </div>
  );
}

export default AdminOrders;
