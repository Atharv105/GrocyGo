import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");
      setFormData({
        mobile: "",
        password: "",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-500 to-green-700 p-12 text-white">
          <ShoppingBasket size={90} />

          <h1 className="text-4xl font-bold mt-6">Smart Grocery</h1>

          <p className="text-center mt-5 text-green-100 leading-7">
            Shop groceries online, book your pickup slot, and collect your order
            without waiting in long queues.
          </p>

          <div className="flex gap-3 mt-8">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back </h2>

          <p className="text-gray-500 mt-2">Sign in to continue shopping.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-600 font-medium">Mobile Number</label>

              <input
                type="text"
                placeholder="Enter your phone number"
                value={formData.mobile}
                onChange={handleChange}
                name="mobile"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Sign In
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="text-green-600 font-semibold ml-2"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
