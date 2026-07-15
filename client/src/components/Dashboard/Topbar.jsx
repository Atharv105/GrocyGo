import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaBell, FaSignOutAlt, FaUserCircle, FaArrowLeft, FaBars } from "react-icons/fa";

function Topbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shadow-sm">
      {/* Left — Back button + welcome */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Toggle Sidebar Button for Mobile */}
        <button
          onClick={toggleSidebar}
          title="Open Menu"
          className="p-2 md:p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition lg:hidden"
        >
          <FaBars size={16} />
        </button>

        <button
          onClick={() => navigate(-1)}
          title="Go Back"
          className="flex items-center gap-2 px-2.5 md:px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition text-sm font-medium"
        >
          <FaArrowLeft size={13} />
          <span className="hidden md:inline">Back</span>
        </button>
        <div className="text-gray-500 text-xs md:text-sm font-medium">
          Welcome back, <span className="text-green-700 font-bold">{user?.name?.split(" ")[0] || "Customer"}</span> 👋
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition text-gray-500 hover:text-gray-700">
          <FaBell size={18} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition"
          >
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
              <FaUserCircle size={22} className="text-green-700" />
            </div>
            <div className="hidden md:block text-left text-sm">
              <p className="font-semibold text-gray-700 leading-tight">
                {user?.name || "Customer"}
              </p>
              <p className="text-gray-400 text-xs leading-none">
                {user?.mobile}
              </p>
            </div>
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              <Link
                to="/"
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                onClick={() => setOpenDropdown(false)}
              >
                Store Home
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                onClick={() => setOpenDropdown(false)}
              >
                Shop
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                onClick={() => setOpenDropdown(false)}
              >
                My Profile
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => {
                  setOpenDropdown(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <FaSignOutAlt size={14} />
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-xl text-sm font-medium transition"
        >
          <FaSignOutAlt size={14} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
