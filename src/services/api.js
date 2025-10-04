import axios from "axios";

const DEFAULT_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export function getBaseUrl() {
  return DEFAULT_BASE_URL;
}

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    Accept: "application/json",
  },
});

// Keep this in sync with store persistence key
const AUTH_PERSIST_KEY = "user";

// Attach token from persisted auth (if present)
axiosInstance.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(AUTH_PERSIST_KEY);
    if (raw) {
      const { auth } = JSON.parse(raw) || {};
      if (auth?.token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${auth.token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
});

export async function apiRequest(path, { method = "GET", headers = {}, body, token } = {}) {
  const config = {
    url: path,
    method,
    headers: { ...headers },
  };

  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  if (method.toUpperCase() === "GET") {
    config.params = body;
  } else {
    config.data = body;
  }

  try {
    const res = await axiosInstance.request(config);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Request failed";
    const error = new Error(message);
    error.status = err?.response?.status;
    error.data = err?.response?.data;
    throw error;
  }
}
