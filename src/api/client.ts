import axios from "axios";

const baseURL = (import.meta.env?.VITE_API_URL ?? "http://localhost:5080").replace(/\/$/, "");

const api = axios.create({ baseURL });

// Log pra depurar: confirma QUAL baseURL está ativa
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[API] baseURL =", baseURL);
}

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("driveon:token") ??
    sessionStorage.getItem("driveon:token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  // forçar Accept JSON (evita aceitar HTML por engano)
  config.headers = { ...(config.headers ?? {}), Accept: "application/json" };

  if (import.meta.env.DEV) {
    const url = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log("[API] →", config.method?.toUpperCase(), url);
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Blindagem: se voltar HTML (fallback), derruba com erro claro
    const ct = String(res.headers?.["content-type"] ?? "").toLowerCase();
    if (ct.includes("text/html")) {
      return Promise.reject(
        new Error(
          "Recebi HTML (provável fallback do Vite). Verifique VITE_API_URL e se a API está online."
        )
      );
    }
    return res;
  },
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
