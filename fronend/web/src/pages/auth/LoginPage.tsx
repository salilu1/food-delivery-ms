import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../store/authStore";
import { decodeJwt } from "../../utils/jwt";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });
      login(data.token);

      const payload = decodeJwt(data.token);
      
      // Smooth redirect based on role
      if (payload?.role === "ADMIN") {
        navigate("/admin/foods");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Hungry? Log in to start ordering.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-xl px-4 py-3 border outline-none transition-all placeholder:text-gray-400"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between mb-1 ml-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <Link to="/forgot-password" title="Recover Password" className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-xl px-4 py-3 border outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L21 21m-2.222-2.222L3 3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2
              ${isSubmitting ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 active:scale-[0.98]"}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-600 font-bold hover:underline underline-offset-4">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}