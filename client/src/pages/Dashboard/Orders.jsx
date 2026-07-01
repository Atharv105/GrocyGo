import { FaClipboardList } from "react-icons/fa";

function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage your orders.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
          <FaClipboardList size={36} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">No Orders Yet</h2>
        <p className="text-gray-400 mt-2 max-w-sm">
          You haven&apos;t placed any orders yet. Once you do, they&apos;ll appear here with full
          tracking details.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Order tracking coming soon
        </span>
      </div>
    </div>
  );
}

export default Orders;
