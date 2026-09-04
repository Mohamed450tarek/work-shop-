 import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      cartId: null,
      cartItems: [],
      totalCartPrice: 0,
      totalPriceAfterDiscount: null,
      couponApplied: null,
      numOfCartItems: 0,
      isLoading: false,
      isUpdating: false,
      error: null,

      // ==================== ACTIONS ====================

      /**
       * Add product to cart
       * POST /cart
       */
      addToCart: async (productId, color = null, quantity = 1) => {
        set({ isLoading: true, error: null });

        try {
          const body = { productId };
          if (color) body.color = color;
          if (quantity > 1) body.quantity = quantity;

          const res = await axiosInstance.post("/cart", body);

          // Extract cartId from response
          const cartData = res.data.data;
          
          set({
            cartId: cartData._id,
            cartItems: cartData.cartItems || [],
            totalCartPrice: cartData.totalCartPrice || 0,
            totalPriceAfterDiscount: cartData.totalPriceAfterDiscount,
            couponApplied: cartData.couponApplied,
            numOfCartItems: res.data.numOfCartItems || cartData.cartItems?.length || 0,
            isLoading: false,
          });

          toast.success(res.data.message || "Added to cart");
          return res.data;
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Failed to add to cart";
          set({
            error: errorMsg,
            isLoading: false,
          });
          toast.error(errorMsg);
          throw err;
        }
      },

      /**
       * Get user cart
       * GET /cart
       */
      getCart: async () => {
        set({ isLoading: true, error: null });

        try {
          const res = await axiosInstance.get("/cart");

          // Extract cartId from response
          const cartData = res.data.data;

          set({
            cartId: cartData._id,
            cartItems: cartData.cartItems || [],
            totalCartPrice: cartData.totalCartPrice || 0,
            totalPriceAfterDiscount: cartData.totalPriceAfterDiscount,
            couponApplied: cartData.couponApplied,
            numOfCartItems: res.data.numOfCartItems || cartData.cartItems?.length || 0,
            isLoading: false,
          });

          return res.data;
        } catch (err) {
          // Reset cart if 404 (no cart exists)
          if (err.response?.status === 404) {
            set({
              cartId: null,
              cartItems: [],
              totalCartPrice: 0,
              totalPriceAfterDiscount: null,
              couponApplied: null,
              numOfCartItems: 0,
              isLoading: false,
            });
            return null;
          }

          const errorMsg = err.response?.data?.message || "Failed to fetch cart";
          set({
            error: errorMsg,
            isLoading: false,
          });
          throw err;
        }
      },

      /**
       * Update cart item quantity
       * PUT /cart/:itemId
       */
      updateCartItemQuantity: async (itemId, quantity) => {
        set({ isUpdating: true, error: null });

        // Optimistic update
        const previousItems = get().cartItems;
        const previousPrice = get().totalCartPrice;

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        }));

        try {
          const res = await axiosInstance.put(`/cart/${itemId}`, { quantity });

          const cartData = res.data.data;

          set({
            cartItems: cartData.cartItems || [],
            totalCartPrice: cartData.totalCartPrice || 0,
            totalPriceAfterDiscount: cartData.totalPriceAfterDiscount,
            numOfCartItems: res.data.numOfCartItems || cartData.cartItems?.length || 0,
            isUpdating: false,
          });

          return res.data;
        } catch (err) {
          // Revert optimistic update
          set({
            cartItems: previousItems,
            totalCartPrice: previousPrice,
            isUpdating: false,
          });

          const errorMsg = err.response?.data?.message || "Failed to update quantity";
          set({ error: errorMsg });
          toast.error(errorMsg);
          throw err;
        }
      },

      /**
       * Remove cart item
       * DELETE /cart/:itemId
       */
      removeCartItem: async (itemId) => {
        set({ isUpdating: true, error: null });

        // Optimistic update
        const previousItems = get().cartItems;
        const previousCount = get().numOfCartItems;
        const previousPrice = get().totalCartPrice;

        const itemToRemove = previousItems.find((item) => item._id === itemId);
        const newPrice = previousPrice - (itemToRemove?.price * itemToRemove?.quantity || 0);

        set((state) => ({
          cartItems: state.cartItems.filter((item) => item._id !== itemId),
          numOfCartItems: Math.max(0, state.numOfCartItems - 1),
          totalCartPrice: Math.max(0, newPrice),
        }));

        try {
          const res = await axiosInstance.delete(`/cart/${itemId}`);

          const cartData = res.data.data;

          set({
            cartItems: cartData?.cartItems || [],
            totalCartPrice: cartData?.totalCartPrice || 0,
            totalPriceAfterDiscount: cartData?.totalPriceAfterDiscount,
            numOfCartItems: res.data.numOfCartItems || cartData?.cartItems?.length || 0,
            isUpdating: false,
          });

          toast.success("Item removed from cart");
          return res.data;
        } catch (err) {
          // Revert optimistic update
          set({
            cartItems: previousItems,
            numOfCartItems: previousCount,
            totalCartPrice: previousPrice,
            isUpdating: false,
          });

          const errorMsg = err.response?.data?.message || "Failed to remove item";
          set({ error: errorMsg });
          toast.error(errorMsg);
          throw err;
        }
      },

      /**
       * Clear entire cart
       * DELETE /cart
       */
      clearCart: async () => {
        set({ isLoading: true, error: null });

        try {
          await axiosInstance.delete("/cart");

          set({
            cartId: null,
            cartItems: [],
            totalCartPrice: 0,
            totalPriceAfterDiscount: null,
            couponApplied: null,
            numOfCartItems: 0,
            isLoading: false,
          });

          toast.success("Cart cleared");
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Failed to clear cart";
          set({
            error: errorMsg,
            isLoading: false,
          });
          toast.error(errorMsg);
          throw err;
        }
      },

      /**
       * Apply coupon
       * PUT /cart/applyCoupon
       */
      applyCoupon: async (couponCode) => {
        set({ isUpdating: true, error: null });

        try {
          const res = await axiosInstance.put("/cart/applyCoupon", {
            coupon: couponCode,
          });

          set({
            totalPriceAfterDiscount: res.data.data.totalPriceAfterDiscount,
            couponApplied: couponCode,
            isUpdating: false,
          });

          toast.success(res.data.message || "Coupon applied successfully");
          return res.data;
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Invalid coupon code";
          set({
            error: errorMsg,
            isUpdating: false,
          });
          toast.error(errorMsg);
          throw err;
        }
      },

      /**
       * Remove coupon
       * DELETE /cart/removeCoupon
       */
      removeCoupon: async () => {
        set({ isUpdating: true, error: null });

        try {
          const res = await axiosInstance.delete("/cart/removeCoupon");

          set({
            totalPriceAfterDiscount: null,
            couponApplied: null,
            totalCartPrice: res.data.data?.totalCartPrice || get().totalCartPrice,
            isUpdating: false,
          });

          toast.success("Coupon removed");
          return res.data;
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Failed to remove coupon";
          set({
            error: errorMsg,
            isUpdating: false,
          });
          toast.error(errorMsg);
          throw err;
        }
      },

      // ==================== UTILITY ACTIONS ====================

      /**
       * Get cart item by product ID
       */
      getCartItem: (productId) => {
        return get().cartItems.find(
          (item) => item.product?._id === productId || item.product === productId
        );
      },

      /**
       * Check if product is in cart
       */
      isInCart: (productId) => {
        return get().cartItems.some(
          (item) => item.product?._id === productId || item.product === productId
        );
      },

      /**
       * Get total items count
       */
      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),

      /**
       * Reset cart (local only - for after successful order)
       */
      resetCart: () =>
        set({
          cartId: null,
          cartItems: [],
          totalCartPrice: 0,
          totalPriceAfterDiscount: null,
          couponApplied: null,
          numOfCartItems: 0,
          error: null,
        }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        // Only persist cart count for badge display
        numOfCartItems: state.numOfCartItems,
        cartId: state.cartId,
      }),
    }
  )
);

export default useCartStore;