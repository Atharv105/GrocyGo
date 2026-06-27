import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      console.log(formData);
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );

      alert(res.data.message);
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-orange-500 to-green-600 p-12 text-white">
          <ShoppingCart size={90} />

          <h1 className="text-4xl font-bold mt-6">Join Smart Grocery</h1>

          <p className="text-center mt-5 text-orange-100 leading-7">
            Create your account and start ordering groceries online with easy
            pickup slot booking.
          </p>
        </div>

        {/* Right */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account 🥕
          </h2>

          <p className="text-gray-500 mt-2">Register to continue.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              name="confirmPass"
              value={formData.confirmPass}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
              Create Account
            </button>

            <p className="text-center text-gray-600">
              Already have an account?
              <Link to="/login" className="text-green-600 font-semibold ml-2">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
