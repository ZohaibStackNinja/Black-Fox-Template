import axios from "axios";

// 1. Automatically add the token to every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Listen for 401 (Unauthorized) errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login"; // Force redirect
    }
    return Promise.reject(error);
  }
);

export default axios;

