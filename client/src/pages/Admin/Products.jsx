import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import API from "../../services/api";
import AddProductModal from "../../components/Admin/AddProductModal";
import EditProductModal from "../../components/Admin/EditProductModal";
import DeleteModal from "../../components/Admin/DeleteModal";

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openAddModal, setOpenAddModal] = useState(location.state?.openAdd || false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        search,
        includeInactive: "true",
      });
      if (selectedCategory) {
        queryParams.append("categoryId", selectedCategory);
      }

      const res = await API.get(`/products?${queryParams.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data.products);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories?includeInactive=true");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/products/${selectedProduct.id}`);
      alert("Product deleted successfully!");
      setOpenDeleteModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500 mt-2">Manage products, stock, and pricing.</p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-md transition"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-96 gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold transition"
          >
            Search
          </button>
        </form>

        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full border px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => {
              const displayEmoji = cat.image && !cat.image.startsWith("http") ? cat.image + " " : "";
              return (
                <option key={cat.id} value={cat.id}>
                  {displayEmoji}{cat.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
          No products found. Add a product to get started.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-600 text-white text-center">
              <tr>
                <th className="p-4">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-2">
                    {product.image && product.image.startsWith("http") ? (
                      <img src={product.image} className="w-12 h-12 object-cover rounded-xl border bg-white mx-auto shadow-sm" alt={product.name} />
                    ) : (
                      <span className="text-4xl">{product.image || "📦"}</span>
                    )}
                  </td>
                  <td className="font-semibold text-gray-800">{product.name}</td>
                  <td className="text-gray-500">{product.Category?.name || "N/A"}</td>
                  <td className="font-semibold text-green-700">₹{product.price}</td>
                  <td className={`font-semibold ${product.stock <= 5 ? "text-red-500 font-bold" : "text-gray-700"}`}>
                    {product.stock}
                  </td>
                  <td className="text-gray-500">{product.unit}</td>
                  <td>
                    <select
                      value={product.isActive ? "true" : "false"}
                      onChange={async (e) => {
                        const newStatus = e.target.value === "true";
                        try {
                          const res = await API.put(`/products/${product.id}`, {
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            stock: product.stock,
                            unit: product.unit,
                            image: product.image,
                            categoryId: product.categoryId,
                            isActive: newStatus
                          });
                          if (res.data.success) {
                            fetchProducts();
                          } else {
                            alert(res.data.message || "Failed to update product status");
                          }
                        } catch (err) {
                          console.error(err);
                          alert(err.response?.data?.message || "Failed to update product status");
                        }
                      }}
                      className={`text-xs font-bold rounded-full px-3 py-1.5 border outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 transition ${
                        product.isActive
                          ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-400"
                          : "bg-red-50 text-red-700 border-red-200 focus:ring-red-400"
                      }`}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-600 hover:text-blue-800 mr-4 text-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-800 text-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-6 bg-gray-50 border-t">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {openAddModal && (
        <AddProductModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onRefresh={fetchProducts}
          categories={categories}
        />
      )}

      {openEditModal && selectedProduct && (
        <EditProductModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          product={selectedProduct}
          onRefresh={fetchProducts}
          categories={categories}
        />
      )}

      {openDeleteModal && selectedProduct && (
        <DeleteModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          itemName={`Product "${selectedProduct.name}"`}
        />
      )}
    </div>
  );
}

export default Products;
