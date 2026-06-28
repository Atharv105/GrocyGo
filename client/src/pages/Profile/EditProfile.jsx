import { useState, useEffect } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          name: res.data.user.name,
          mobile: res.data.user.mobile,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:5000/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile Updated Successfully");

      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg">
        {/* Header */}

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-3xl py-8">
          <h1 className="text-3xl font-bold text-center text-white">
            Edit Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          {/* Profile Image */}

          <div className="flex flex-col items-center">
            <div className="relative">
              <FaUserCircle size={120} className="text-green-600" />

              <label className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer">
                <FaCamera />
                <input type="file" className="hidden" />
              </label>
            </div>

            <p className="text-gray-500 mt-3">Change Profile Picture</p>
          </div>

          {/* Name */}

          <div className="mt-10">
            <label className="font-medium">Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Mobile */}

          <div className="mt-6">
            <label className="font-medium">Mobile Number</label>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-10">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 border border-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
