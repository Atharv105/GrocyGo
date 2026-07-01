import { FaUsers } from "react-icons/fa";

function Customers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-500 mt-2">View and manage registered customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5">
          <FaUsers size={36} className="text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Customer Management</h2>
        <p className="text-gray-400 mt-2 max-w-md">
          Browse registered customers, view their order history, and manage
          accounts. This section will be available once the customer API is
          complete.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Customer management coming soon
        </span>
      </div>
    </div>
  );
}

export default Customers;
