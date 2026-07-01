import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Eye, EyeOff, AlertCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.mobile || !formData.password) {
      setError("Mobile number and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData.mobile, formData.password);
      if (res.success) {
        // Redirect based on role
        navigate(res.user?.role === "ADMIN" ? "/admin" : "/dashboard");
      } else {
        setError(res.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-500 to-green-700 p-12 text-white">
          <ShoppingBasket size={90} />
          <h1 className="text-4xl font-bold mt-6">GrocyGo</h1>
          <p className="text-center mt-5 text-green-100 leading-7">
            Shop groceries online, book your pickup slot, and collect your order
            without waiting in long queues.
          </p>
          <div className="flex gap-3 mt-8">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 mt-2">Sign in to continue shopping.</p>

          {/* Error Banner */}
          {error && (
            <div className="mt-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Mobile */}
            <div>
              <label className="text-gray-600 font-medium text-sm">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-600 font-medium text-sm">Password</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-green-600 font-semibold ml-1">
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
