import axios from "axios";

 export const axiosInstance = axios.create({
 // baseURL: "https://newgatebackend-chatapp-production.up.railway.app/api",
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// Request interceptor: attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.dispatchEvent(new Event("auth-logout"));
    }
    return Promise.reject(error);
  }
);
