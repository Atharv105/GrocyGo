import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const { cartItems, cartTotal, cartLoading, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

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
              const itemTotal = price * item.quantity;

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
                    <p className="text-green-700 font-semibold mt-1">
                      ₹{price.toFixed(2)} × {item.quantity} = <span className="text-gray-800">₹{itemTotal.toFixed(2)}</span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border-2 border-green-200 flex items-center justify-center hover:bg-green-50 transition text-green-700 font-bold"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 99)}
                      className="w-8 h-8 rounded-full border-2 border-green-200 flex items-center justify-center hover:bg-green-50 transition text-green-700 font-bold disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-[160px]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0 ml-2">
                      ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
                onClick={() => alert("Order placement coming soon! 🚧")}
              >
                <ShoppingCart size={20} />
                Place Order
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
    </div>
  );
}

export default Cart;
