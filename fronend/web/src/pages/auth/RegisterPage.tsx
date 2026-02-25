import { useState } from "react";
import { registerCustomer } from "../../services/authService";
import { useAuth } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // Basic Client-side Validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setError("");
    setIsSubmitting(true);

    try {
      const data = await registerCustomer({ name, email, password });
      login(data.token);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed. Try a different email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-xl px-4 py-3 border outline-none transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1 ml-1";

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join TaemFood and satisfy your cravings.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              name="name"
              type="text"
              required
              className={inputClass}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className={inputClass}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              className={inputClass}
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={isSubmitting}
            className={`w-full py-4 mt-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2
              ${isSubmitting ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 active:scale-[0.98]"}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}