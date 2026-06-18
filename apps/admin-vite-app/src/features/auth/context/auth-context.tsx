import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/auth.api";
import type { AuthUser } from "../types/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const USER_KEY = "holte_user";
const TOKEN_KEY = "holte_access_token";

function readStorage<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function decodeJwt(jwt: string): Record<string, string> {
  const base64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStorage<AuthUser>(USER_KEY));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback((u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, t);
  }, []);

  const logout = useCallback(() => {
    const revokeToken = localStorage.getItem(TOKEN_KEY);
    // Gọi API revoke token, không chờ kết quả — xóa local state ngay
    if (revokeToken) {
      authApi.logout(revokeToken).catch(() => {});
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!user && !!token, login, logout }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
