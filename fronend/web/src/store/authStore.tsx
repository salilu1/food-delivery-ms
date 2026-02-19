import { createContext, useContext, useEffect, useState } from "react";
import { decodeJwt, type JwtPayload } from "../utils/jwt";
import { getToken, removeToken, saveToken } from "../utils/token";

type AuthState = {
  token: string | null;
  user: JwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<JwtPayload | null>(
    token ? decodeJwt(token) : null
  );

  const login = (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(decodeJwt(newToken));
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    // on refresh, restore
    const stored = getToken();
    if (stored) {
      setToken(stored);
      setUser(decodeJwt(stored));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
