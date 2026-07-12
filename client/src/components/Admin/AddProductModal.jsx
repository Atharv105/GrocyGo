import { useState, useEffect } from "react";
import { FaTimes, FaCloud } from "react-icons/fa";
import API from "../../services/api";
import CloudinaryGalleryModal from "./CloudinaryGalleryModal";

function AddProductModal({ isOpen, onClose, onRefresh, categories }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cloudinaryProducts, setCloudinaryProducts] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadCloudinary = async () => {
        try {
          const res = await API.get("/cloudinary/images");
          if (res.data.success) {
            setCloudinaryProducts(res.data.data.products);
          }
        } catch (err) {
          console.error("Failed to load Cloudinary product images", err);
        }
      };
      loadCloudinary();
    }
  }, [isOpen]);

  const normalize = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "");
  };

  // Helper to find matching image from Cloudinary list
  const autoSelectImage = (prodName, catId) => {
    if (!prodName || !cloudinaryProducts.length) return;

    // Get the selected category name
    const selectedCat = categories.find((c) => c.id === parseInt(catId));
    const catName = selectedCat ? selectedCat.name : "";

    const normTyped = normalize(prodName);
    
    // 1. First, search for exact matches in the specific category if category is selected
    let match = null;
    if (catName) {
      const normCat = normalize(catName);
      const categorySpecificProducts = cloudinaryProducts.filter((p) => {
        const normFolder = normalize(p.folderName);
        return normFolder === normCat || normFolder.includes(normCat) || normCat.includes(normFolder);
      });
      
      match = categorySpecificProducts.find((p) => normalize(p.folderName) === normTyped);
    }

    // 2. If no category-specific match, search globally in all product folders
    if (!match) {
      match = cloudinaryProducts.find((p) => normalize(p.folderName) === normTyped);
    }

    // 3. Search for folder containing query or vice-versa
    if (!match) {
      match = cloudinaryProducts.find((p) => {
        const normFolder = normalize(p.folderName);
        return normTyped.includes(normFolder) || normFolder.includes(normTyped);
      });
    }

    // 4. Search for filename match
    if (!match) {
      match = cloudinaryProducts.find((p) => {
        const normFile = normalize(p.filename);
        return normTyped.includes(normFile) || normFile.includes(normTyped);
      });
    }

    if (match) {
      setImage(match.url);
    }
  };

  useEffect(() => {
    autoSelectImage(name, categoryId);
  }, [name, categoryId, cloudinaryProducts]);

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
            <label className="font-medium text-gray-700">Product Image URL / Emoji *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter emoji (e.g. 🥭) or Cloudinary URL"
                className="flex-1 mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="mt-2 bg-green-550 border border-green-600 hover:bg-green-50 text-green-700 font-semibold px-4 rounded-xl flex items-center gap-1.5 transition text-sm shadow-sm"
              >
                <FaCloud /> Gallery
              </button>
            </div>

            {/* Preview */}
            {image && (
              <div className="mt-3 p-3 bg-gray-50 border rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                {image.startsWith("http") ? (
                  <img
                    src={image}
                    className="w-14 h-14 object-cover rounded-lg border bg-white"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-4xl p-1 bg-white border rounded-lg">{image}</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500">Image Preview</p>
                  <p className="text-xs text-gray-700 truncate font-mono">{image}</p>
                </div>
              </div>
            )}
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

      {galleryOpen && (
        <CloudinaryGalleryModal
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          onSelect={(url) => {
            setImage(url);
            setGalleryOpen(false);
          }}
          initialTab="products"
          currentCategoryName={
            categories.find((c) => c.id === parseInt(categoryId))?.name || ""
          }
        />
      )}
    </div>
  );
}

export default AddProductModal;
