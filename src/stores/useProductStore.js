 import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,

 
  getProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {
       
      const params = new URLSearchParams();
      
      if (filters.products) params.append('products', filters.products);
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('price[gte]', filters.minPrice.toString());
      if (filters.maxPrice) params.append('price[lte]', filters.maxPrice.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());

      const queryString = params.toString();
      const url = `/products${queryString ? `?${queryString}` : ''}`;
      
      const res = await axiosInstance.get(url);
      
      set({
        products: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Something went wrong",
        isLoading: false,
      });
    }
  },
 
  getProductById: async (id) => {
    set({ isLoading: true, error: null, product: null });

    try {
      const res = await axiosInstance.get(`/products/${id}`);
      set({
        product: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch product",
        isLoading: false,
        product: null,
      });
    }
  },

 
  searchProducts: async (query) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get(`/products?search=${query}`);
      set({
        products: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to search products",
        isLoading: false,
      });
    }
  },
}));