import { FaPlus } from "react-icons/fa";
import CategoryTable from "../../components/Admin/CategoryTable";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AddCategoryModal from "../../components/Admin/AddCategoryModal";
import API from "../../services/api";

function Categories() {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(location.state?.openAdd || false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories?includeInactive=true");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Category Management
          </h1>
          <p className="text-gray-500 mt-2">Manage grocery categories.</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mt-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Category..."
          className="
          w-full
          md:w-96
          px-5
          py-3
          rounded-xl
          border
          outline-none
          focus:ring-2
          focus:ring-green-500
          "
        />
      </div>

      {/* Table */}
      <div className="mt-8">
        <CategoryTable 
          categories={filteredCategories} 
          loading={loading} 
          onRefresh={fetchCategories} 
        />
        <AddCategoryModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onRefresh={fetchCategories}
        />
      </div>
    </div>
  );
}

export default Categories;
