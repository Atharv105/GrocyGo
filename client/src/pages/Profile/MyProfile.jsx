import {
  FaUserCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await API.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);
  if (!user) {
    return <h2 className="text-center mt-20">Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 h-36"></div>

          {/* Profile */}
          <div className="px-8 pb-8">
            <div className="-mt-16 flex flex-col items-center">
              <FaUserCircle
                className="text-white bg-green-600 rounded-full"
                size={120}
              />

              <h1 className="text-3xl font-bold mt-4">{user.name}</h1>

              <p className="text-gray-500">GrocyGo Customer</p>
            </div>

            {/* Information */}

            <div className="grid md:grid-cols-2 gap-8 mt-10">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-green-50">
                <FaPhoneAlt className="text-green-700 text-xl" />

                <div>
                  <p className="text-gray-500 text-sm">Mobile Number</p>

                  <h3 className="font-semibold">{user.mobile}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-green-50">
                <FaMapMarkerAlt className="text-green-700 text-xl" />

                <div>
                  <p className="text-gray-500 text-sm">Address</p>

                  <h3 className="font-semibold">{user.address || "Not Provided"}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-green-50">
                <FaCalendarAlt className="text-green-700 text-xl" />

                <div>
                  <p className="text-gray-500 text-sm">Member Since</p>

                  <h3 className="font-semibold">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => (window.location.href = "/profile/edit")}
                className="
                flex
                items-center
                gap-3
                bg-green-600
                text-white
                px-8
                py-4
                rounded-2xl
                hover:bg-green-700
                transition
                "
              >
                <FaEdit />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
