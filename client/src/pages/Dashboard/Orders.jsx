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
  Ban
} from "lucide-react";
import * as orderService from "../../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail Modal State
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Cancellation Confirmation Modal State
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getMyOrders();
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
        const res = await orderService.getOrderById(selectedOrderId);
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

  // Handle Order Cancellation
  const handleCancelOrder = async () => {
    if (!cancellingOrderId) return;
    try {
      setCancelLoading(true);
      setCancelError(null);
      const res = await orderService.cancelOrder(cancellingOrderId);
      if (res.success) {
        // Update local list
        setOrders(prev => prev.map(o => o.id === cancellingOrderId ? { ...o, status: "CANCELLED" } : o));
        setCancellingOrderId(null);
      } else {
        setCancelError(res.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      setCancelError(err.response?.data?.message || err.message || "Could not cancel order.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={12} /> COMPLETED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <Ban size={12} /> CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 animate-pulse">
            <Clock size={12} /> PENDING
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            PAID
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status || "PENDING"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-green-700 font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Orders 📦</h1>
        <p className="text-gray-500 mt-1">Track and manage your order history.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
          <AlertTriangle className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 flex flex-col items-center text-center border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <ClipboardList size={44} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">No Orders Yet</h2>
          <p className="text-gray-400 mt-2 max-w-sm">
            You haven't placed any orders yet. Browse our inventory to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Side: Order Meta */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-bold text-gray-800">
                    Order #{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="font-bold text-green-700">₹{parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setSelectedOrderId(order.id)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm transition border border-gray-200"
                >
                  <Eye size={16} /> View Items
                </button>

                {order.status === "PENDING" && (
                  <button
                    onClick={() => setCancellingOrderId(order.id)}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm transition border border-red-100"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Order Details #{selectedOrderId}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Line items & information</p>
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
                <>
                  {/* Summary row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Status</p>
                      <div className="mt-1">{getStatusBadge(orderDetails.status)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Payment</p>
                      <div className="mt-1">{getPaymentStatusBadge(orderDetails.paymentStatus)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Amount</p>
                      <p className="text-base font-bold text-green-700 mt-1">₹{parseFloat(orderDetails.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ordered On</p>
                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        {new Date(orderDetails.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
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
                  </div>
                </>
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

      {/* Cancellation Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            <h3 className="text-lg font-bold text-gray-800">Cancel Order #{cancellingOrderId}?</h3>
            <p className="text-gray-500 text-sm mt-2">
              Are you sure you want to cancel this order? This will release the products back to active inventory. This action cannot be undone.
            </p>

            {cancelError && (
              <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
                {cancelError}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCancellingOrderId(null)}
                disabled={cancelLoading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5"
              >
                {cancelLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
