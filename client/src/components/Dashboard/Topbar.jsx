import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSignOutAlt, FaUserCircle, FaArrowLeft } from "react-icons/fa";

function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm">
      {/* Left — Back button + welcome */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          title="Go Back"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition text-sm font-medium"
        >
          <FaArrowLeft size={13} />
          <span className="hidden md:inline">Back</span>
        </button>
        <div className="text-gray-500 text-sm font-medium">
          Welcome back, <span className="text-green-700 font-bold">{user?.name?.split(" ")[0] || "Customer"}</span> 👋
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition text-gray-500 hover:text-gray-700">
          <FaBell size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
            <FaUserCircle size={22} className="text-green-700" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-700">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.mobile}</p>
          </div>
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
