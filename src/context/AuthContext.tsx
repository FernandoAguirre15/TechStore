import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: (reason?: string) => void;
  sessionMessage: string | null;
  clearSessionMessage: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useCallback((newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(
    (reason?: string) => {
      localStorage.removeItem("token");
      setToken(null);
      if (reason) setSessionMessage(reason);
      navigate("/login");
    },
    [navigate]
  );

  const clearSessionMessage = useCallback(() => setSessionMessage(null), []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, logout, sessionMessage, clearSessionMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
