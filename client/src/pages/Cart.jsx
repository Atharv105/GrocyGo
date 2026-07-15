import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import * as orderService from "../services/orderService";
import * as slotService from "../services/slotService";

function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const { cartItems, cartTotal, cartLoading, updateQuantity, removeFromCart, clearCart, fetchCart } = useContext(CartContext);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [tempQuantities, setTempQuantities] = useState({});

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slotsError, setSlotsError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!isLoggedIn) return;
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        const res = await slotService.getAvailableSlots(selectedDate);
        if (res.success) {
          setAvailableSlots(res.data || []);
          setSelectedSlotId(null);
        } else {
          setSlotsError(res.message || "Failed to load slots");
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Error loading slots:", err);
        setSlotsError(
          err.response?.data?.message || "Could not load pickup slots."
        );
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, isLoggedIn]);

  const formatTime12h = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    let hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12;
    hr = hr ? hr : 12;
    return `${hr.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const handleCheckout = async () => {
    if (!selectedSlotId) {
      setCheckoutError("Please select a pickup slot before placing your order.");
      return;
    }
    try {
      setIsCheckoutLoading(true);
      setCheckoutError(null);

      // Check if there are any temp quantities that haven't been saved yet
      const pendingItemIds = Object.keys(tempQuantities);
      if (pendingItemIds.length > 0) {
        for (const itemId of pendingItemIds) {
          const item = cartItems.find((i) => i.id === parseInt(itemId, 10));
          if (item) {
            const rawVal = tempQuantities[itemId];
            let val = parseInt(rawVal, 10);
            if (isNaN(val) || val < 1) val = 1;
            const maxStock = item.stock || 999;
            const finalVal = Math.min(val, maxStock);
            await updateQuantity(item.productId, finalVal);
          }
        }
        setTempQuantities({});
      }

      const res = await orderService.checkout(selectedSlotId, "CASH");
      if (res.success) {
        clearCart();
        navigate("/dashboard/orders");
      } else {
        setCheckoutError(res.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      setCheckoutError(
        err.response?.data?.message || 
        err.message || 
        "Something went wrong while placing your order."
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-700">Please Login</h2>
          <p className="text-gray-400 mt-2 mb-6">Login to view your cart.</p>
          <Link
            to="/login"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-700 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={52} className="text-green-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
          <p className="text-gray-400 mt-2 mb-8 max-w-sm mx-auto">
            Browse our fresh products and add items to your cart.
          </p>
          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const getDynamicQty = (item) => {
    const tempVal = tempQuantities[item.id];
    if (tempVal === undefined) return item.quantity;
    if (tempVal === "") return 0;
    const val = parseInt(tempVal, 10);
    return isNaN(val) ? 0 : val;
  };

  const getDynamicItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    return price * getDynamicQty(item);
  };

  const getDynamicCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + getDynamicItemTotal(item), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-200 transition"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Cart 🛒</h1>
              <p className="text-gray-500">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition font-medium text-sm"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => {
              const price = parseFloat(item.price || 0);
              const itemTotal = getDynamicItemTotal(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-5"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl flex items-center justify-center text-4xl shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                    {item.image && item.image.startsWith("http") ? (
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    ) : (
                      item.image || "📦"
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-xs text-green-600 font-medium">{item.unit}</p>
                    <div className="flex items-center gap-2 text-green-700 font-semibold mt-1.5 flex-wrap">
                      <span>₹{price.toFixed(2)}</span>
                      <span className="text-gray-400">×</span>
                      <input
                        type="number"
                        min="1"
                        max={item.stock || 999}
                        value={tempQuantities[item.id] !== undefined ? tempQuantities[item.id] : item.quantity}
                        onFocus={(e) => {
                          e.target.select();
                          setTempQuantities((prev) => ({ ...prev, [item.id]: item.quantity.toString() }));
                        }}
                        onChange={(e) => {
                          const rawVal = e.target.value;
                          setTempQuantities((prev) => ({ ...prev, [item.id]: rawVal }));
                        }}
                        onBlur={() => {
                          const rawVal = tempQuantities[item.id];
                          if (rawVal === undefined) return;

                          let val = parseInt(rawVal, 10);
                          if (isNaN(val) || val < 1) {
                            val = 1;
                          }
                          const maxStock = item.stock || 999;
                          const finalVal = Math.min(val, maxStock);
                          updateQuantity(item.productId, finalVal);

                          setTempQuantities((prev) => {
                            const copy = { ...prev };
                            delete copy[item.id];
                            return copy;
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.target.blur();
                          }
                        }}
                        className="w-16 h-8 text-center border-2 border-green-200 rounded-xl font-bold text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
                      />
                      <span className="text-gray-400">=</span>
                      <span className="text-gray-800">₹{itemTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                {cartItems.map((item) => {
                  const qty = getDynamicQty(item);
                  const total = getDynamicItemTotal(item);
                  return (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="truncate max-w-[160px]">
                        {item.name} × {qty}
                      </span>
                      <span className="font-medium shrink-0 ml-2">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700">₹{getDynamicCartTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Pickup Slot Selection */}
              <div className="border-t border-gray-100 mt-5 pt-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <span className="text-orange-500">⏰</span> Select Pickup Slot
                </h3>
                
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-medium">Pickup Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {slotsLoading ? (
                  <div className="flex items-center justify-center py-4 gap-2">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-green-700">Loading slots...</span>
                  </div>
                ) : slotsError ? (
                  <p className="text-xs text-red-500">{slotsError}</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-xs text-orange-500 bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                    No slots available for this date.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block font-medium">Available Times</label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-green-600 bg-green-50 text-green-800 font-bold shadow-sm"
                                : "border-gray-200 hover:border-green-400 hover:bg-green-50/30 text-gray-700"
                            }`}
                          >
                            <span>
                              {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                              slot.availableCapacity <= 5
                                ? "bg-orange-50 text-orange-600 font-medium"
                                : "bg-green-50 text-green-600"
                            }`}>
                              {slot.availableCapacity} left
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {checkoutError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2 animate-shake">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-md shadow-green-200"
                onClick={handleCheckout}
                disabled={isCheckoutLoading || !selectedSlotId}
              >
                {isCheckoutLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Place Order
                  </>
                )}
              </button>

              <Link
                to="/products"
                className="block mt-3 text-center text-green-600 hover:underline font-medium text-sm"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Success Modal */}
      {checkoutSuccessOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 transform scale-100 transition-all">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500 animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Order Placed! 🎉</h2>
            <p className="text-gray-500 mb-6">
              Thank you for shopping with GrocyGo. Your order has been registered successfully.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left border border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-bold text-gray-800">#{checkoutSuccessOrder.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-bold text-green-700">₹{parseFloat(checkoutSuccessOrder.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  {checkoutSuccessOrder.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
                  {checkoutSuccessOrder.paymentStatus}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/dashboard/orders")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-green-100"
              >
                Track My Orders
              </button>
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold transition border border-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
