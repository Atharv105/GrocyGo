import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import API from "../../services/api";

function AddProductModal({ isOpen, onClose, onRefresh, categories }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !stock || !unit.trim() || !categoryId || !image.trim()) {
      alert("All fields marked with * are required");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Price must be a number greater than 0");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert("Stock must be a positive integer or 0");
      return;
    }

    try {
      setLoading(true);
      await API.post("/products", {
        name: name.trim(),
        price: priceNum,
        stock: stockNum,
        unit: unit.trim(),
        categoryId: parseInt(categoryId),
        description: description.trim(),
        image: image.trim(),
      });

      alert("Product created successfully!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Add Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="col-span-2">
              <label className="font-medium text-gray-700">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Product Name (e.g., Alphonso Mango)"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="font-medium text-gray-700">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="font-medium text-gray-700">Stock *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            {/* Unit */}
            <div>
              <label className="font-medium text-gray-700">Unit (e.g. 1 Kg, 500 ml) *</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unit size"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-medium text-gray-700">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.image} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Product Description"
              className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none"
            />
          </div>

          {/* Image/Emoji */}
          <div>
            <label className="font-medium text-gray-700">Product Emoji / Icon *</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter emoji (e.g. 🥭)"
              className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-2xl"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-xl hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
