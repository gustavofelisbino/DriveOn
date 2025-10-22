import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../api/api";

type User = {
  id: number;
  email: string;
  nome: string;
  tipo: string;
  oficinaId: number; // ✅ vínculo direto com a oficina
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("driveon:token") ?? sessionStorage.getItem("driveon:token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("driveon:user") ?? sessionStorage.getItem("driveon:user");
    return raw ? JSON.parse(raw) : null;
  });

  // Persistência segura
  const persist = (t: string, u: User, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("driveon:token", t);
    storage.setItem("driveon:user", JSON.stringify(u));
    setToken(t);
    setUser(u);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  // Login
  const signIn = async (email: string, password: string, remember: boolean) => {
    try {
      const { data } = await api.post("/auth/login", { email, senha: password });

      const { token, usuario } = data;
      const normalizedUser: User = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo,
        oficinaId: usuario.oficinaId, // vem do backend
      };

      persist(token, normalizedUser, remember);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "E-mail ou senha inválidos.");
    }
  };

  // Logout
  const signOut = () => {
    localStorage.removeItem("driveon:token");
    localStorage.removeItem("driveon:user");
    sessionStorage.removeItem("driveon:token");
    sessionStorage.removeItem("driveon:user");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  // Setar header automaticamente se já logado
  if (token && !api.defaults.headers.common["Authorization"]) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      signIn,
      signOut,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
