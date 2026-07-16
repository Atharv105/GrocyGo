import { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Eye, 
  X, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  ShoppingBag,
  Info,
  CheckCircle,
  Clock,
  Ban,
  Search,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  CreditCard
} from "lucide-react";
import * as orderService from "../../services/orderService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  // Detail Modal State
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Status updates in modal/table
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getAllOrdersAdmin();
      if (res.success) {
        setOrders(res.data || []);
      } else {
        setError(res.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch Order Details when selectedOrderId changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedOrderId) {
        setOrderDetails(null);
        return;
      }
      try {
        setDetailsLoading(true);
        setDetailsError(null);
        const res = await orderService.getOrderByIdAdmin(selectedOrderId);
        if (res.success) {
          setOrderDetails(res.data);
        } else {
          setDetailsError(res.message || "Failed to load order details");
        }
      } catch (err) {
        console.error(err);
        setDetailsError(err.response?.data?.message || err.message || "Could not fetch details.");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [selectedOrderId]);

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    // Prevent completed -> pending transition
    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder && currentOrder.status === "COMPLETED" && newStatus === "PENDING") {
      alert("Cannot change status back to PENDING once it is COMPLETED.");
      return;
    }

    // Confirmation popup for marking as COMPLETED
    if (newStatus === "COMPLETED") {
      const confirmComplete = window.confirm("Are you sure you want to mark this order as COMPLETED?");
      if (!confirmComplete) {
        return;
      }
    }

    try {
      setStatusUpdateLoading(prev => ({ ...prev, [orderId]: true }));
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrderId === orderId) {
          setOrderDetails(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert(res.message || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to update order status");
    } finally {
      setStatusUpdateLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Handle Payment Status Update
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      setStatusUpdateLoading(prev => ({ ...prev, [`pay-${orderId}`]: true }));
      const res = await orderService.updateOrderPaymentStatus(orderId, newPaymentStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o));
        if (selectedOrderId === orderId) {
          setOrderDetails(prev => prev ? { ...prev, paymentStatus: newPaymentStatus } : null);
        }
      } else {
        alert(res.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to update payment status");
    } finally {
      setStatusUpdateLoading(prev => ({ ...prev, [`pay-${orderId}`]: false }));
    }
  };

  // Status Badge Helper
  const getStatusSelectStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200 focus:ring-green-400";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200 focus:ring-red-400";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-400";
    }
  };

  // Payment Status Badge Helper
  const getPaymentSelectStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-300 focus:ring-green-500";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-300 focus:ring-red-500";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300 focus:ring-gray-400";
    }
  };

  // Statistics Calculations
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING" || o.status === "CONFIRMED").length,
    confirmed: orders.filter(o => o.status === "CONFIRMED").length,
    completed: orders.filter(o => o.status === "COMPLETED").length,
    cancelled: orders.filter(o => o.status === "CANCELLED").length,
    revenue: orders
      .filter(o => o.paymentStatus === "PAID")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
  };

  // Filters & Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "ALL" || order.status === activeTab;
    
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toString().includes(term) ||
      (order.User?.name || "").toLowerCase().includes(term) ||
      (order.User?.mobile || "").includes(term) ||
      (order.User?.email || "").toLowerCase().includes(term);

    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-green-700 font-medium">Loading store orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-gray-500 mt-2 text-base">Monitor customer baskets, coordinate pickups, and update checkout statuses.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
          <AlertTriangle className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Total Orders</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <ClipboardList size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Pending Orders</p>
            <h3 className="text-3xl font-extrabold text-yellow-600 mt-1">{stats.pending}</h3>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Completed Orders</p>
            <h3 className="text-3xl font-extrabold text-green-600 mt-1">{stats.completed}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Cancelled Orders</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1">{stats.cancelled}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <Ban size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Paid Revenue</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">₹{stats.revenue.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeTab === tab
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4">Order ID</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Customer</th>
                <th scope="col" className="px-6 py-4">Amount</th>
                <th scope="col" className="px-6 py-4 text-center">Order Status</th>
                <th scope="col" className="px-6 py-4 text-center">Payment Status</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 font-medium">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <p className="font-semibold">{order.User?.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.User?.mobile || "No Mobile"}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-700 whitespace-nowrap">
                      ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={statusUpdateLoading[order.id] || order.status === "CANCELLED"}
                        className={`text-xs font-bold rounded-full px-3 py-1.5 border outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 transition ${getStatusSelectStyle(
                          order.status
                        )}`}
                      >
                        <option value="PENDING" disabled={order.status === "COMPLETED"}>PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        {order.status === "CANCELLED" && (
                          <option value="CANCELLED">CANCELLED</option>
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                        disabled={statusUpdateLoading[`pay-${order.id}`]}
                        className={`text-xs font-bold rounded-full px-3 py-1.5 border outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 transition ${getPaymentSelectStyle(
                          order.paymentStatus
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-gray-200"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Order Details #{selectedOrderId}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Line items, Customer contact, and Status update actions</p>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-1.5 rounded-xl hover:bg-gray-200 transition text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {detailsLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-green-700 font-medium text-sm">Fetching items...</p>
                </div>
              )}

              {detailsError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0" />
                  <span>{detailsError}</span>
                </div>
              )}

              {orderDetails && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Items */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <ShoppingBag size={18} className="text-green-600" />
                      Items Summary ({orderDetails.OrderItems?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {orderDetails.OrderItems?.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm"
                        >
                          {/* Product Image */}
                          <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                            {item.Product?.image && item.Product.image.startsWith("http") ? (
                              <img src={item.Product.image} className="w-full h-full object-cover" alt={item.Product?.name} />
                            ) : (
                              item.Product?.image || "📦"
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-gray-800 text-sm truncate">
                              {item.Product?.name || "Product Unavailable"}
                            </h5>
                            <p className="text-xs text-gray-400">{item.Product?.unit || ""}</p>
                          </div>

                          {/* Calculation */}
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-gray-800">
                              ₹{parseFloat(item.subtotal || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">
                              ₹{parseFloat(item.price || 0).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <span className="font-bold text-gray-700">Total Bill:</span>
                      <span className="text-xl font-extrabold text-green-700">₹{parseFloat(orderDetails.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Right Column: Customer & Status */}
                  <div className="space-y-6">
                    {/* Customer details card */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2 pb-2 border-b">
                        <User size={16} className="text-green-600" />
                        Customer Contact
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">Name</p>
                          <p className="font-bold text-gray-800 mt-0.5">{orderDetails.User?.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">Mobile</p>
                          <p className="font-medium text-gray-700 mt-0.5 flex items-center gap-1.5">
                            <Phone size={13} className="text-gray-400" />
                            {orderDetails.User?.mobile || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick status updates */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard size={16} className="text-green-600" />
                        Update Status
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 block mb-1">Order Status</label>
                          <select
                            value={orderDetails.status}
                            onChange={(e) => handleStatusChange(orderDetails.id, e.target.value)}
                            disabled={statusUpdateLoading[orderDetails.id] || orderDetails.status === "CANCELLED"}
                            className={`w-full text-sm font-bold rounded-xl p-2.5 border outline-none cursor-pointer focus:ring-2 transition ${getStatusSelectStyle(
                              orderDetails.status
                            )}`}
                          >
                            <option value="PENDING" disabled={orderDetails.status === "COMPLETED"}>PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            {orderDetails.status === "CANCELLED" && (
                              <option value="CANCELLED">CANCELLED</option>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-400 block mb-1">Payment Status</label>
                          <select
                            value={orderDetails.paymentStatus}
                            onChange={(e) => handlePaymentStatusChange(orderDetails.id, e.target.value)}
                            className={`w-full text-sm font-bold rounded-xl p-2.5 border outline-none cursor-pointer focus:ring-2 transition ${getPaymentSelectStyle(
                              orderDetails.paymentStatus
                            )}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="FAILED">FAILED</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
