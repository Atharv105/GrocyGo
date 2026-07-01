import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, mobile, password, confirmPassword } = formData;

    if (!name || !mobile || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (mobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, mobile, password);
      if (res.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-orange-500 to-green-600 p-12 text-white">
          <ShoppingCart size={90} />
          <h1 className="text-4xl font-bold mt-6">Join GrocyGo</h1>
          <p className="text-center mt-5 text-orange-100 leading-7">
            Create your account and start ordering fresh groceries online with
            easy pickup slot booking — no queues, no hassle.
          </p>
          <div className="flex gap-3 mt-8">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-orange-200" />
            <div className="w-3 h-3 rounded-full bg-orange-200" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800">Create Account 🥕</h2>
          <p className="text-gray-500 mt-2">Register to get started.</p>

          {/* Error / Success Banner */}
          {error && (
            <div className="mt-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mt-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <CheckCircle size={18} className="shrink-0" />
              {success}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="text-gray-600 font-medium text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-gray-600 font-medium text-sm">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="text-gray-600 font-medium text-sm">Confirm Password</label>
              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-semibold ml-1">
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
