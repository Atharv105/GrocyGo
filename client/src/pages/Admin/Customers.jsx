import { useState, useEffect } from "react";
import { FaUsers, FaPhoneAlt, FaUserCircle, FaSearch } from "react-icons/fa";
import API from "../../services/api";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // NOTE: A dedicated customer list API endpoint is not yet implemented.
  // This page is prepared and will work once the /api/customers route is added to the backend.

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Customer Management</h1>
        <p className="text-gray-500 mt-2">View and manage all registered customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
          <FaUsers size={36} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Customer List</h2>
        <p className="text-gray-400 mt-2 max-w-sm">
          Customer management will be available once the customer API endpoint is connected.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Customer management coming soon
        </span>
      </div>
    </div>
  );
}

export default AdminCustomers;
