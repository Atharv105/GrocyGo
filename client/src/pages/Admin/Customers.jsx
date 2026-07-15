import { useState, useEffect } from "react";
import { FaUsers, FaPhoneAlt, FaUserCircle, FaSearch, FaShoppingBag, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import * as orderService from "../../services/orderService";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomersFromOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all orders
        const res = await orderService.getAllOrdersAdmin();
        if (res.success) {
          const orders = res.data || [];
          
          // Group by user
          const customerMap = {};
          orders.forEach((order) => {
            if (order.User) {
              const u = order.User;
              if (!customerMap[u.id]) {
                customerMap[u.id] = {
                  id: u.id,
                  name: u.name,
                  mobile: u.mobile || u.phone || "N/A",
                  orderCount: 0,
                  totalSpent: 0,
                  lastOrderDate: order.createdAt,
                  orders: [],
                };
              }
              
              customerMap[u.id].orderCount += 1;
              if (order.status !== "CANCELLED") {
                customerMap[u.id].totalSpent += parseFloat(order.totalAmount || 0);
              }
              
              if (new Date(order.createdAt) > new Date(customerMap[u.id].lastOrderDate)) {
                customerMap[u.id].lastOrderDate = order.createdAt;
              }
              customerMap[u.id].orders.push(order);
            }
          });

          setCustomers(Object.values(customerMap));
        } else {
          setError(res.message || "Failed to retrieve customers list.");
        }
      } catch (err) {
        console.error("Error gathering customer list:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Could not compile customer listings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersFromOrders();
  }, []);

  // Filter list by search term
  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.mobile.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Customer Directory</h1>
        <p className="text-gray-500 mt-2">View and manage all registered store customers based on active order metrics.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="text-sm font-semibold text-gray-500 self-end sm:self-center">
          Showing <span className="text-gray-800">{filteredCustomers.length}</span> customers
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-green-700 font-medium">Loading customers...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
            <FaUsers size={36} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700">No Customers Found</h2>
          <p className="text-gray-400 mt-2 max-w-sm">
            {search ? "No customers match your search filters." : "Customers will show up here once orders are placed."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 pl-6">Customer Info</th>
                  <th className="py-3.5">Mobile</th>
                  <th className="py-3.5">Orders Count</th>
                  <th className="py-3.5">Total Spent</th>
                  <th className="py-3.5 pr-6">Last Active</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Customer Info */}
                    <td className="py-4 pl-6 flex items-center gap-3">
                      <FaUserCircle className="text-gray-300 text-3xl" />
                      <div>
                        <p className="font-bold text-gray-800">{customer.name}</p>
                        <p className="text-[10px] text-gray-400">ID: #{customer.id}</p>
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FaPhoneAlt size={11} className="text-gray-300" />
                        <span className="font-medium text-xs">{customer.mobile}</span>
                      </div>
                    </td>

                    {/* Orders Count */}
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <FaShoppingBag size={12} className="text-gray-300" />
                        <span className="font-semibold">{customer.orderCount} order{customer.orderCount !== 1 ? "s" : ""}</span>
                      </div>
                    </td>

                    {/* Total Spent */}
                    <td className="py-4">
                      <div className="flex items-center gap-0.5 text-green-700 font-bold">
                        <span>₹</span>
                        <span>{customer.totalSpent.toFixed(2)}</span>
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 pr-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt size={12} className="text-gray-300" />
                        <span>
                          {new Date(customer.lastOrderDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
