"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    api
      .get<{ user: User }>("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await api.post<{ user: User }>("/api/auth/login", {
        email,
        password,
      });
      setUser(data.user);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Login failed";
      setError(msg);
      throw e;
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setError(null);
      try {
        const data = await api.post<{ user: User }>("/api/auth/register", {
          email,
          password,
          name,
        });
        setUser(data.user);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Registration failed";
        setError(msg);
        throw e;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await api.post<{ ok: boolean }>("/api/auth/logout", {});
    } catch {
      // Swallow — still clear local state
    }
    setUser(null);
  }, []);

  const loginWithGoogle = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${baseUrl}/api/auth/google`;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
