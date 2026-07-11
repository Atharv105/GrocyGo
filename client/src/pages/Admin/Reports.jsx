import { useState, useEffect } from "react";
import { FaChartBar, FaBoxes, FaTags, FaArrowUp } from "react-icons/fa";
import API from "../../services/api";

function AdminReports() {
  const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get("/products?limit=1000"),
          API.get("/categories"),
        ]);

        const products = prodRes.data.data?.products || [];
        const categories = catRes.data.data || [];

        setStats({
          totalProducts: prodRes.data.data?.totalProducts || 0,
          totalCategories: categories.length,
          lowStock: products.filter((p) => p.stock <= 5).length,
        });
      } catch (err) {
        console.error("Error fetching report stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: <FaBoxes />, color: "bg-green-500" },
    { label: "Total Categories", value: stats.totalCategories, icon: <FaTags />, color: "bg-orange-500" },
    { label: "Low Stock Items", value: stats.lowStock, icon: <FaBoxes />, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500 mt-2">Overview of your store's performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-gray-100">
            <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {loading ? "..." : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Charts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartBar className="text-green-600" /> Sales Overview
        </h2>
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <FaChartBar size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Sales charts will appear here</p>
            <span className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
              🚧 Charts coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
