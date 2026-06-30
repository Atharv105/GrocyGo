import {
  FaBoxes,
  FaTags,
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import API from "../../services/api";

import StatCard from "../../components/Admin/StatCard";
import QuickActions from "../../components/Admin/QuickActions";
import RecentOrders from "../../components/Admin/RecentOrders";
import LowStockProducts from "../../components/Admin/LowStockProducts";

function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const prodRes = await API.get("/products?limit=1");
        if (prodRes.data.success) {
          setProductCount(prodRes.data.data.totalProducts);
        }

        const catRes = await API.get("/categories");
        if (catRes.data.success) {
          setCategoryCount(catRes.data.data.length);
        }

        const lowStockRes = await API.get("/products?limit=1000");
        if (lowStockRes.data.success) {
          const lowStockItems = lowStockRes.data.data.products.filter(
            (p) => p.stock <= 5
          );
          setLowStockCount(lowStockItems.length);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800">Welcome Back 👋</h1>

      <p className="text-gray-500 mt-2">
        Here's what's happening in your grocery store today.
      </p>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        <StatCard
          title="Products"
          value={loading ? "..." : productCount.toString()}
          icon={<FaBoxes />}
          color="bg-green-600"
        />

        <StatCard
          title="Categories"
          value={loading ? "..." : categoryCount.toString()}
          icon={<FaTags />}
          color="bg-orange-500"
        />

        <StatCard
          title="Low Stock Items"
          value={loading ? "..." : lowStockCount.toString()}
          icon={<FaBoxes />}
          color="bg-red-500"
        />

        <StatCard
          title="Customers"
          value="1,540"
          icon={<FaUsers />}
          color="bg-blue-600"
        />

        <StatCard
          title="Orders Today"
          value="82"
          icon={<FaClipboardList />}
          color="bg-purple-600"
        />

        <StatCard
          title="Revenue Today"
          value="₹18,450"
          icon={<FaMoneyBillWave />}
          color="bg-emerald-600"
        />
        
        <QuickActions />
        
        <div className="grid lg:grid-cols-2 gap-8 mt-8 col-span-1 md:col-span-2 xl:col-span-3">
          <RecentOrders />
          <LowStockProducts />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
