"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const stored = localStorage.getItem("token");

  const restore = stored
    ? api("/auth/me", { token: stored })
        .then((data) => {
          setToken(stored);
          setUser(data.user);
        })
        .catch(() => localStorage.removeItem("token"))
    : Promise.resolve();

  restore.finally(() => setLoading(false));
}, []);

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    saveSession(data);
  };

  const register = async (name, email, password) => {
    const data = await api("/auth/register", { method: "POST", body: { name, email, password } });
    saveSession(data);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);