import {
  FaHome,
  FaClipboardList,
  FaHeart,
  FaClock,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function CustomerSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const menus = [
    { title: "Store Home", icon: <FaHome />, path: "/" },
    { title: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { title: "My Orders", icon: <FaClipboardList />, path: "/dashboard/orders" },
    { title: "Wishlist", icon: <FaHeart />, path: "/dashboard/wishlist" },
    { title: "Pickup Slots", icon: <FaClock />, path: "/dashboard/slots" },
    { title: "Addresses", icon: <FaMapMarkerAlt />, path: "/dashboard/address" },
    { title: "Settings", icon: <FaCog />, path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-green-700 to-green-900 text-white h-screen shadow-xl flex flex-col">
      {/* User Info */}
      <div className="p-8 border-b border-green-600">
        <div className="flex items-center gap-3">
          <FaUserCircle size={48} className="text-green-200 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold truncate">{user?.name || "Customer"}</h2>
            <p className="text-green-200 text-sm truncate">{user?.mobile}</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-green-600/50 px-3 py-1 rounded-full text-xs font-medium">
          <span className="w-2 h-2 bg-green-300 rounded-full" />
          Customer Account
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menus.map((menu) => (
          <NavLink
            key={menu.title}
            to={menu.path}
            end={menu.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl mb-2 transition-all font-medium ${
                isActive
                  ? "bg-white text-green-700 font-semibold shadow-md"
                  : "hover:bg-green-600/60 text-green-100"
              }`
            }
          >
            <span className="text-base">{menu.icon}</span>
            {menu.title}
          </NavLink>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-green-600 space-y-2">
        <NavLink
          to="/profile"
          className="flex items-center gap-4 px-5 py-3 rounded-xl hover:bg-green-600/60 text-green-100 transition font-medium"
        >
          <FaUserCircle />
          My Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl transition font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default CustomerSidebar;
