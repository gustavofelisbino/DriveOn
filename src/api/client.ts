// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL ?? "http://localhost:5080",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("driveon:token") ??
    sessionStorage.getItem("driveon:token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("driveon:token");
      localStorage.removeItem("driveon:user");
      sessionStorage.removeItem("driveon:token");
      sessionStorage.removeItem("driveon:user");
      if (location.pathname !== "/login") location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
