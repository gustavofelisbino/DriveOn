import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";

type User = { usuarioId: number; nome: string; cargo: string; empresaId: number; };
type MultipleCompaniesError = { code: "MULTIPLE_COMPANIES"; empresas: { id: number; nome: string }[] };

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void | MultipleCompaniesError>;
  signInWithCompany: (email: string, password: string, empresaId: number, remember: boolean) => Promise<void>;
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

  const persist = (t: string, u: User, remember: boolean) => {
    const store = remember ? localStorage : sessionStorage;
    store.setItem("driveon:token", t);
    store.setItem("driveon:user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const signIn = async (email: string, password: string, remember: boolean) => {
    const res = await api.post(
      "/api/auth/login-email",
      { email, password },
      { validateStatus: s => (s >= 200 && s < 300) || s === 409 }
    );

    if (res.status === 200 && res.data?.token) {
      const { token, usuarioId, nome, cargo, empresaId } = res.data;
      persist(token, { usuarioId, nome, cargo, empresaId }, remember);
      return;
    }

    if (res.status === 409 && res.data?.code === "MULTIPLE_COMPANIES") {
      return { code: "MULTIPLE_COMPANIES", empresas: res.data.empresas };
    }

    throw new Error(typeof res.data === "string" ? res.data : "E-mail ou senha inválidos.");
  };

  const signInWithCompany = async (email: string, password: string, empresaId: number, remember: boolean) => {
    const { data } = await api.post("/api/auth/login", { email, password, empresaId });
    const { token, usuarioId, nome, cargo, empresaId: empId } = data;
    persist(token, { usuarioId, nome, cargo, empresaId: empId }, remember);
  };

  const signOut = () => {
    localStorage.removeItem("driveon:token");
    localStorage.removeItem("driveon:user");
    sessionStorage.removeItem("driveon:token");
    sessionStorage.removeItem("driveon:user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user, token, isAuthenticated: !!token, signIn, signInWithCompany, signOut
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
