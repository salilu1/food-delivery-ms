import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../store/authStore";
import { decodeJwt } from "../../utils/jwt";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
  const data = await loginUser({ email, password });
  login(data.token);

  // use JWT decoded role (not backend response)
  const payload = decodeJwt(data.token);

  if (payload?.role === "ADMIN") navigate("/admin/foods");
  else navigate("/");
} catch (err: any) {
  setError(err?.response?.data?.error || "Login failed");
}

  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white rounded-lg py-2">
          Login
        </button>
      </form>
    </div>
  );
}
