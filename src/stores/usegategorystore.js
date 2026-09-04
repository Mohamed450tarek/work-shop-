import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCategoryStore = create((set) => ({
  categories: [],
  category: null,
  isLoading: false,
  error: null,

  // Get all categories
  getCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get('/categories');
      set({
        categories: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  // Get specific category by id
  getCategoryById: async (id) => {
    set({ isLoading: true, error: null, category: null });

    try {
      const res = await axiosInstance.get(`/categories/${id}`);
      set({
        category: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch category",
        isLoading: false,
        category: null,
      });
    }
  },
}));