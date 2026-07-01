import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Topbar() {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm border-b px-8 py-5 flex items-center justify-between sticky top-0 z-10">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <p className="text-gray-500 text-sm">
          Welcome back, {user?.name || "Admin"} 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-72 pl-11 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none text-sm"
          />
        </div>

        {/* Notification */}
        <button className="relative p-3 rounded-full hover:bg-gray-100 transition">
          <FaBell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <FaUserCircle size={40} className="text-green-700" />
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-none">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
