import { useState, useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function ProductCard({ product }) {
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart!");
      return;
    }
    if (product.stock === 0) return;
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
      {/* Stock Badge */}
      <div className="flex justify-end items-center mb-1">
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product image + info */}
      <div className="text-center mt-2 flex-1 flex flex-col items-center">
        <div className="w-32 h-32 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 border shadow-sm">
          {product.image && product.image.startsWith("http") ? (
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          ) : (
            <span className="text-7xl">{product.image || "📦"}</span>
          )}
        </div>

        <h3 className="mt-5 text-lg font-bold text-gray-800">{product.name}</h3>

        <p className="text-gray-500 mt-2 text-sm">{product.unit}</p>

        <h4 className="text-2xl font-bold text-green-700 mt-3">
          ₹{parseFloat(product.price).toFixed(2)}
        </h4>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0 || adding}
        className={`w-full mt-6 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2
          ${added
            ? "bg-green-100 text-green-700"
            : "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          }`}
      >
        {adding ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingCart size={16} />
            {added ? "Added! ✓" : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}

export default ProductCard;
