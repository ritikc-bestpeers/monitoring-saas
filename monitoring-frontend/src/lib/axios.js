// lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1",
//   withCredentials: true, // if using cookies/sessions
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // attach token if available
    const token = typeof window !== "undefined" ? sessionStorage.getItem("MS_TOKEN") || localStorage.getItem("MS_TOKEN") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
    if (error.response?.status === 401) {
      // handle unauthorized globally
      console.warn("Unauthorized, redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
