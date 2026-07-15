import { useState, useEffect } from "react";
import { FaChartBar, FaBoxes, FaTags, FaShoppingBag, FaDollarSign, FaCalculator } from "react-icons/fa";
import API from "../../services/api";

function AdminReports() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
  });
  const [orderStats, setOrderStats] = useState({
    totalRevenue: 0,
    aov: 0,
    orderCount: 0,
  });
  const [statusDistribution, setStatusDistribution] = useState({
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  });
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, orderRes] = await Promise.all([
          API.get("/products?limit=1000"),
          API.get("/categories"),
          API.get("/orders/admin/orders"),
        ]);

        // Products and categories
        const products = prodRes.data.data?.products || [];
        const categories = catRes.data.data || [];
        setStats({
          totalProducts: prodRes.data.data?.totalProducts || 0,
          totalCategories: categories.length,
          lowStock: products.filter((p) => p.stock <= 5).length,
        });

        // Orders processing
        const orders = orderRes.data.data || [];
        const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
        const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
        const aov = paidOrders.length ? totalRevenue / paidOrders.length : 0;
        
        setOrderStats({
          totalRevenue,
          aov,
          orderCount: orders.length,
        });

        // Calculate status distribution
        const dist = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
        orders.forEach((o) => {
          if (dist[o.status] !== undefined) {
            dist[o.status]++;
          }
        });
        setStatusDistribution(dist);

        // Calculate last 7 days sales map (initialized to 0)
        const dailyMap = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          dailyMap[dateStr] = {
            dateLabel: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
            revenue: 0,
          };
        }

        // Fill sales data
        orders.forEach((o) => {
          const dateStr = o.createdAt.split("T")[0];
          if (dailyMap[dateStr] && o.paymentStatus === "PAID") {
            dailyMap[dateStr].revenue += parseFloat(o.totalAmount || 0);
          }
        });

        setDailySales(Object.values(dailyMap));
      } catch (err) {
        console.error("Error loading report analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `₹${orderStats.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`, icon: <FaDollarSign />, color: "bg-emerald-500", text: "Paid earnings" },
    { label: "Average Order Value (AOV)", value: `₹${orderStats.aov.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`, icon: <FaCalculator />, color: "bg-blue-500", text: "Revenue per paid basket" },
    { label: "Total Orders", value: orderStats.orderCount.toString(), icon: <FaShoppingBag />, color: "bg-purple-500", text: "Placed order logs" },
    { label: "Total Products", value: stats.totalProducts.toString(), icon: <FaBoxes />, color: "bg-green-500", text: "Active catalog items" },
    { label: "Total Categories", value: stats.totalCategories.toString(), icon: <FaTags />, color: "bg-orange-500", text: "Product groups" },
    { label: "Low Stock Alerts", value: stats.lowStock.toString(), icon: <FaBoxes />, color: "bg-red-500", text: "5 units or less" },
  ];

  // SVG Chart configurations
  const maxRevenue = Math.max(...dailySales.map((d) => d.revenue), 100); // fallback to 100
  const chartHeight = 150;
  const barWidth = 44;
  const gap = 30;
  const paddingLeft = 50;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-gray-500 mt-2 text-base">Visualize financial metrics and category catalogs.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-5 border border-gray-100 hover:shadow-md transition duration-200">
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white text-xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? "..." : card.value}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Interactive SVG Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <FaChartBar className="text-green-600" /> Daily Revenue (Last 7 Days)
            </h2>
            <p className="text-xs text-gray-400 mb-6">Excludes pending or cancelled orders.</p>
          </div>

          <div className="h-64 flex items-end justify-center">
            {loading ? (
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-20" />
            ) : dailySales.length === 0 ? (
              <div className="text-gray-400 text-sm mb-20">No sales records to plot.</div>
            ) : (
              <div className="w-full h-full relative">
                <svg viewBox="0 0 600 240" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="570" y2="20" stroke="#f9fafb" strokeWidth="1" />
                  <line x1="50" y1="70" x2="570" y2="70" stroke="#f9fafb" strokeWidth="1" />
                  <line x1="50" y1="120" x2="570" y2="120" stroke="#f9fafb" strokeWidth="1" />
                  <line x1="50" y1="170" x2="570" y2="170" stroke="#f3f4f6" strokeWidth="1.5" />
                  
                  {/* Y-Axis Labels */}
                  <text x="35" y="24" textAnchor="end" className="text-[10px] fill-gray-400 font-bold">₹{Math.round(maxRevenue).toLocaleString()}</text>
                  <text x="35" y="98" textAnchor="end" className="text-[10px] fill-gray-400 font-bold">₹{Math.round(maxRevenue / 2).toLocaleString()}</text>
                  <text x="35" y="174" textAnchor="end" className="text-[10px] fill-gray-400 font-bold">₹0</text>

                  {dailySales.map((day, index) => {
                    const barHeight = (day.revenue / maxRevenue) * chartHeight;
                    const x = paddingLeft + index * (barWidth + gap) + 15;
                    const y = 170 - barHeight;
                    const isHovered = hoveredBarIndex === index;

                    return (
                      <g 
                        key={index}
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        className="cursor-pointer group"
                      >
                        {/* Hover Overlay */}
                        <rect
                          x={x - 8}
                          y="10"
                          width={barWidth + 16}
                          height="160"
                          fill={isHovered ? "rgba(243, 244, 246, 0.45)" : "transparent"}
                          rx="10"
                          className="transition-colors duration-150"
                        />
                        
                        {/* Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill={isHovered ? "#059669" : "#10b981"}
                          rx="5"
                          className="transition-all duration-300 ease-out"
                        />
                        
                        {/* Label */}
                        <text
                          x={x + barWidth / 2}
                          y="190"
                          textAnchor="middle"
                          className={`text-[10px] font-bold transition-colors duration-150 ${isHovered ? "fill-gray-800" : "fill-gray-400"}`}
                        >
                          {day.dateLabel}
                        </text>

                        {/* Tooltip */}
                        {isHovered && (
                          <g className="animate-fadeIn">
                            <rect
                              x={x + barWidth / 2 - 50}
                              y={y - 32}
                              width="100"
                              height="24"
                              fill="#1f2937"
                              rx="6"
                              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                            />
                            <text
                              x={x + barWidth / 2}
                              y={y - 16}
                              textAnchor="middle"
                              fill="#ffffff"
                              className="text-[10px] font-extrabold"
                            >
                              ₹{day.revenue.toFixed(2)}
                            </text>
                            <polygon
                              points={`${x + barWidth / 2 - 4},${y - 8} ${x + barWidth / 2 + 4},${y - 8} ${x + barWidth / 2},${y - 4}`}
                              fill="#1f2937"
                            />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Status Allocation</h2>
            <p className="text-xs text-gray-400 mb-6">Proportion of orders by status.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-5 flex-1 flex flex-col justify-center">
              {Object.entries(statusDistribution).map(([status, count]) => {
                const total = orderStats.orderCount || 1;
                const percentage = ((count / total) * 100).toFixed(0);
                
                let progressColor = "bg-yellow-500";
                if (status === "CONFIRMED") progressColor = "bg-blue-500";
                if (status === "COMPLETED") progressColor = "bg-green-500";
                if (status === "CANCELLED") progressColor = "bg-red-500";

                return (
                  <div key={status} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700">{status}</span>
                      <span className="text-gray-400 font-semibold">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
