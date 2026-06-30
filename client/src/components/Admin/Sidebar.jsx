import {
  FaHome,
  FaTags,
  FaShoppingBasket,
  FaClipboardList,
  FaClock,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/admin",
    },
    {
      title: "Categories",
      icon: <FaTags />,
      path: "/admin/categories",
    },
    {
      title: "Products",
      icon: <FaShoppingBasket />,
      path: "/admin/products",
    },
    {
      title: "Orders",
      icon: <FaClipboardList />,
      path: "/admin/orders",
    },
    {
      title: "Pickup Slots",
      icon: <FaClock />,
      path: "/admin/slots",
    },
    {
      title: "Customers",
      icon: <FaUsers />,
      path: "/admin/customers",
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      path: "/admin/reports",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-green-700 to-green-900 text-white min-h-screen shadow-xl flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-green-600">
        <h1 className="text-3xl font-bold">🛒 GrocyGo</h1>

        <p className="text-green-200 mt-2">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menus.map((menu) => (
          <NavLink
            key={menu.title}
            to={menu.path}
            end={menu.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl mb-3 transition-all ${
                isActive
                  ? "bg-white text-green-700 font-semibold"
                  : "hover:bg-green-600"
              }`
            }
          >
            {menu.icon}
            {menu.title}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-green-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 bg-red-500 hover:bg-red-600 px-5 py-4 rounded-xl transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
