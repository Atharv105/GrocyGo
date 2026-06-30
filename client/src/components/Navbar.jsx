import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  FaUserCircle,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-11 h-11 rounded-full bg-green-600 flex items-center justify-center text-white text-xl">
              🛒
            </div>

            <div>
              <h1 className="text-2xl font-bold text-green-700">GrocyGo</h1>

              <p className="text-xs text-gray-500">Fresh & Queue Free</p>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search groceries, fruits, vegetables..."
              className="
              w-full
              bg-green-50
              border
              border-green-200
              rounded-full
              py-3
              pl-12
              pr-5
              outline-none
              focus:border-green-500
              focus:ring-2
              focus:ring-green-200
              transition
              "
            />
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="
                  px-5
                  py-2.5
                  text-green-700
                  font-medium
                  rounded-full
                  hover:bg-green-50
                  transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                  px-5
                  py-2.5
                  bg-green-600
                  text-white
                  font-medium
                  rounded-full
                  hover:bg-green-700
                  transition
                  "
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Cart */}
                <button
                  className="
    relative
    p-3
    rounded-full
    hover:bg-green-50
    transition
    "
                >
                  <ShoppingCart size={24} className="text-green-700" />

                  <span
                    className="
      absolute
      -top-1
      -right-1
      bg-orange-500
      text-white
      text-xs
      w-5
      h-5
      rounded-full
      flex
      items-center
      justify-center
      "
                  >
                    2
                  </span>
                </button>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="
      w-11
      h-11
      rounded-full
      bg-green-100
      flex
      items-center
      justify-center
      hover:bg-green-200
      transition
      "
                  >
                    <FaUserCircle size={28} className="text-green-700" />
                  </button>

                  {/* Dropdown */}
                  {openProfile && (
                    <div
                      className="
        absolute
        right-0
        mt-3
        w-56
        bg-white
        rounded-2xl
        shadow-xl
        border
        border-green-100
        overflow-hidden
        "
                    >
                      <Link
                        to="/profile"
                        className="
          flex
          items-center
          gap-3
          px-5
          py-4
          hover:bg-green-50
          transition
          "
                      >
                        <FaUser className="text-green-700" />
                        My Profile
                      </Link>

                      <Link
                        to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
                        className="
          flex
          items-center
          gap-3
          px-5
          py-4
          hover:bg-green-50
          transition
          "
                      >
                        <FaTachometerAlt className="text-green-700" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="
          w-full
          flex
          items-center
          gap-3
          px-5
          py-4
          text-red-500
          hover:bg-red-50
          transition
          "
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            <Menu size={28} className="text-green-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden py-4 border-t">
            <input
              type="text"
              placeholder="Search groceries..."
              className="
              w-full
              bg-green-50
              border
              border-green-200
              rounded-xl
              p-3
              mb-4
              outline-none
              "
            />

            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="
                  flex-1
                  text-center
                  py-3
                  rounded-xl
                  border
                  border-green-600
                  text-green-700
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                  flex-1
                  text-center
                  py-3
                  rounded-xl
                  bg-green-600
                  text-white
                  "
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="block">
                  Dashboard
                </Link>

                <Link to="/profile" className="block">
                  Profile
                </Link>

                <button onClick={handleLogout} className="text-red-500">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
