import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle, FaPhoneAlt, FaEdit, FaShieldAlt } from "react-icons/fa";

function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences.</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUserCircle className="text-green-600" />
          Account Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <FaUserCircle className="text-green-600 text-xl shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</p>
              <p className="font-semibold text-gray-800 mt-0.5">{user?.name || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <FaPhoneAlt className="text-green-600 text-xl shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mobile Number</p>
              <p className="font-semibold text-gray-800 mt-0.5">{user?.mobile || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <FaShieldAlt className="text-green-600 text-xl shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Account Role</p>
              <p className="font-semibold text-gray-800 mt-0.5">{user?.role || "CUSTOMER"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <FaEdit />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">App Preferences</h2>
        <p className="text-gray-400 text-sm">
          Notification settings, theme preferences, and more will be available
          here soon.
        </p>
        <span className="mt-4 inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-medium">
          🚧 More settings coming soon
        </span>
      </div>
    </div>
  );
}

export default Settings;
