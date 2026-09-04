 import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const persistAuth = (authUser) => {
  if (authUser?.token) {
    localStorage.setItem("authToken", authUser.token);
    localStorage.setItem("authUser", JSON.stringify(authUser));
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authUser.token}`;
  }
};

const recoverAuth = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("authUser");

  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return parsedUser;
    } catch (e) {
      console.warn("Failed to parse authUser from localStorage", e);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      return null;
    }
  }
  return null;
};

export const useAuthStore = create((set, get) => ({
   
  authUser: recoverAuth(),
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const recovered = recoverAuth();
      if (recovered) {
        set({ authUser: recovered });
      } else {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        persistAuth(res.data);
      }
    } catch (error) {
      set({ authUser: null });
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const userData = { ...res.data.data, token: res.data.token };
      set({ authUser: userData });
      persistAuth(userData);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const userData = { ...res.data.data, token: res.data.token };
      set({ authUser: userData });
      persistAuth(userData);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: () => {
    set({ authUser: null });
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    toast.success("Logged out successfully");
  },

  
   editProfile: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/edit-profile", data);
      const userData = { ...res.data.data, token: res.data.token };
      set({ authUser: userData });
      persistAuth(userData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));


 