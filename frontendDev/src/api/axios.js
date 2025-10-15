import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/` || "http://localhost:8000/api/v1/",
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // or Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: auto-logout if token is invalid/expired
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
