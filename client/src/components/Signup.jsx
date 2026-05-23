import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser } from "../redux/slice/auth/authThunk";
import AuthLayout from "./layout/AuthLayout";
import Spinner from "./ui/Spinner";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", fullname: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.fullname || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("Account created!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start sharing files with a personal dashboard"
      alternate={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--primary-text)] hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-color)] mb-1.5">Full name</label>
          <input
            className="input-field"
            type="text"
            name="fullname"
            onChange={handleChange}
            value={formData.fullname}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-color)] mb-1.5">Email</label>
          <input
            className="input-field"
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-color)] mb-1.5">Password</label>
          <div className="relative">
            <input
              className="input-field pr-12"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--secondary-text)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? <Spinner size="sm" className="border-white border-t-transparent" /> : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
