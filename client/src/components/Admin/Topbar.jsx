import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

function Topbar() {
  return (
    <header className="bg-white shadow-sm border-b px-8 py-5 flex items-center justify-between">
      {/* Left */}

      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

        <p className="text-gray-500">Welcome back, Admin 👋</p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">
        {/* Search */}

        <div className="relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search products..."
            className="
            w-80
            pl-12
            pr-4
            py-3
            rounded-xl
            border
            focus:ring-2
            focus:ring-green-500
            outline-none
            "
          />
        </div>

        {/* Notification */}

        <button
          className="
          relative
          p-3
          rounded-full
          hover:bg-gray-100
          "
        >
          <FaBell size={22} className="text-gray-700" />

          <span
            className="
            absolute
            -top-1
            -right-1
            bg-red-500
            text-white
            w-5
            h-5
            rounded-full
            text-xs
            flex
            items-center
            justify-center
            "
          >
            3
          </span>
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3">
          <FaUserCircle size={45} className="text-green-700" />

          <div>
            <h4 className="font-semibold">Admin</h4>

            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
