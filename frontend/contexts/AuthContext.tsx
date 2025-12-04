"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react";
import { api, AuthResponse } from "../lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthResponse = (res: AuthResponse) => {
    setUser(res.data.user);
    // Store tokens and user data if provided
    if (typeof window !== 'undefined') {
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
      }
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      // Store user object for session persistence
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password });
    handleAuthResponse(res);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.register({ name, email, password });
    handleAuthResponse(res);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      // Even if logout fails on backend, clear local state
      console.error('Logout error:', error);
    } finally {
      // Always clear user state
      setUser(null);
      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  }, []);

  // Try to restore session on mount from localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken');
          const storedUser = localStorage.getItem('user');
          
          if (accessToken && storedUser) {
            // Restore user from localStorage directly
            try {
              const userData = JSON.parse(storedUser);
              if (!cancelled) {
                setUser(userData);
              }
            } catch (error) {
              // If parsing fails, clear everything
              console.error('Failed to parse stored user:', error);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              if (!cancelled) setUser(null);
            }
          } else {
            if (!cancelled) setUser(null);
          }
        }
      } catch (error) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
