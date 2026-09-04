 import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

/**
 * Order Store - Manages all order-related state and API calls
 *
 * Backend shippingAddress structure:
 * {
 *   fullname: String (required),
 *   phone: String (required),
 *   city: String (required),
 *   street: String (required),
 *   details: String (optional),
 *   postalCode: String (optional)
 * }
 */

export const useOrderStore = create((set, get) => ({
  // ==================== STATE ====================
  orders: [],
  currentOrder: null,
  orderTracking: null,
  orderStats: null,
  deliveryStats: null,
  checkoutSessionUrl: null,

  isLoading: false,
  isCreatingOrder: false,
  isUpdating: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // ==================== USER ACTIONS ====================

  /**
   * Create Cash Order
   * POST /orders/cash/:cartId
   * @param {string} cartId - Cart ID
   * @param {Object} shippingAddress - { fullname, phone, city, street, details?, postalCode? }
   */
  createCashOrder: async (cartId, shippingAddress) => {
    set({ isCreatingOrder: true, error: null });

    try {
      const res = await axiosInstance.post(`/orders/cash/${cartId}`, {
        shippingAddress,
      });

      set({
        currentOrder: res.data.data,
        isCreatingOrder: false,
      });

      toast.success("Order placed successfully! 🎉");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create order";
      set({
        error: errorMsg,
        isCreatingOrder: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Create Stripe Checkout Session
   * POST /orders/checkout/:cartId
   * @param {string} cartId - Cart ID
   * @param {Object} shippingAddress - { fullname, phone, city, street, details?, postalCode? }
   */
  createCheckoutSession: async (cartId, shippingAddress) => {
    set({ isCreatingOrder: true, error: null });

    try {
      const res = await axiosInstance.post(`/orders/checkout/${cartId}`, {
        shippingAddress,
      });

      const sessionUrl = res.data.session?.url || res.data.url;

      set({
        checkoutSessionUrl: sessionUrl,
        currentOrder: res.data.data,
        isCreatingOrder: false,
      });

      // Redirect to Stripe checkout
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create checkout session";
      set({
        error: errorMsg,
        isCreatingOrder: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Get User's Orders
   * GET /orders/my-orders
   */
  getUserOrders: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);

      const queryString = queryParams.toString();
      const url = `/orders/my-orders${queryString ? `?${queryString}` : ""}`;

      const res = await axiosInstance.get(url);

      set({
        orders: res.data.data || [],
        pagination: {
          page: res.data.page || 1,
          limit: res.data.limit || 10,
          total: res.data.results || res.data.data?.length || 0,
          totalPages: res.data.pagination?.totalPages || 1,
        },
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch orders";
      set({
        error: errorMsg,
        isLoading: false,
        orders: [],
      });
      // Don't show toast for empty orders (404)
      if (err.response?.status !== 404) {
        toast.error(errorMsg);
      }
      throw err;
    }
  },

  /**
   * Get Order by ID
   * GET /orders/:id
   */
  getOrderById: async (orderId) => {
    set({ isLoading: true, error: null, currentOrder: null });

    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);

      set({
        currentOrder: res.data.data,
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Order not found";
      set({
        error: errorMsg,
        isLoading: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Get Delivery Tracking
   * GET /orders/:id/tracking
   */
  getDeliveryTracking: async (orderId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get(`/orders/${orderId}/tracking`);

      set({
        orderTracking: res.data.data,
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch tracking info";
      set({
        error: errorMsg,
        isLoading: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  // ==================== ADMIN ACTIONS ====================

  /**
   * Get All Orders (Admin)
   * GET /orders
   */
  getAllOrders: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.isPaid !== undefined) queryParams.append("isPaid", params.isPaid.toString());
      if (params.paymentMethodType) queryParams.append("paymentMethodType", params.paymentMethodType);

      const queryString = queryParams.toString();
      const url = `/orders${queryString ? `?${queryString}` : ""}`;

      const res = await axiosInstance.get(url);

      set({
        orders: res.data.data || [],
        pagination: {
          page: res.data.pagination?.currentPage || 1,
          limit: params.limit || 10,
          total: res.data.pagination?.totalOrders || res.data.results || 0,
          totalPages: res.data.pagination?.totalPages || 1,
        },
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch orders";
      set({
        error: errorMsg,
        isLoading: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Confirm Order (Admin)
   * PATCH /orders/:id/confirm
   */
  confirmOrder: async (orderId) => {
    set({ isUpdating: true, error: null });

    try {
      const res = await axiosInstance.patch(`/orders/${orderId}/confirm`);

      // Update order in list
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data.data : order
        ),
        currentOrder:
          state.currentOrder?._id === orderId ? res.data.data : state.currentOrder,
        isUpdating: false,
      }));

      toast.success("Order confirmed successfully");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to confirm order";
      set({
        error: errorMsg,
        isUpdating: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Cancel Order (Admin)
   * PATCH /orders/:id/cancel
   */
  cancelOrder: async (orderId, reason = "") => {
    set({ isUpdating: true, error: null });

    try {
      const res = await axiosInstance.patch(`/orders/${orderId}/cancel`, {
        cancellationReason: reason,
      });

      // Update order in list
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data.data : order
        ),
        currentOrder:
          state.currentOrder?._id === orderId ? res.data.data : state.currentOrder,
        isUpdating: false,
      }));

      toast.success("Order cancelled");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to cancel order";
      set({
        error: errorMsg,
        isUpdating: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Mark Order as Delivered (Admin)
   * PATCH /orders/:id/delivered
   */
  markAsDelivered: async (orderId) => {
    set({ isUpdating: true, error: null });

    try {
      const res = await axiosInstance.patch(`/orders/${orderId}/delivered`);

      // Update order in list
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data.data : order
        ),
        currentOrder:
          state.currentOrder?._id === orderId ? res.data.data : state.currentOrder,
        isUpdating: false,
      }));

      toast.success("Order marked as delivered");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update order";
      set({
        error: errorMsg,
        isUpdating: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Update Order Status (Admin)
   * PATCH /orders/:id/status
   */
  updateOrderStatus: async (orderId, status) => {
    set({ isUpdating: true, error: null });

    try {
      const res = await axiosInstance.patch(`/orders/${orderId}/status`, {
        status,
      });

      // Update order in list
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data.data : order
        ),
        currentOrder:
          state.currentOrder?._id === orderId ? res.data.data : state.currentOrder,
        isUpdating: false,
      }));

      toast.success(`Order status updated to ${status}`);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update order status";
      set({
        error: errorMsg,
        isUpdating: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Bulk Update Orders to Delivered (Admin)
   * POST /orders/bulk/delivered
   */
  bulkMarkAsDelivered: async (orderIds) => {
    set({ isUpdating: true, error: null });

    try {
      const res = await axiosInstance.post("/orders/bulk/delivered", {
        orderIds,
      });

      // Refresh orders list
      await get().getAllOrders();

      set({ isUpdating: false });

      toast.success(`${res.data.modified} orders marked as delivered`);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update orders";
      set({
        error: errorMsg,
        isUpdating: false,
      });
      toast.error(errorMsg);
      throw err;
    }
  },

  /**
   * Get Order Statistics (Admin)
   * GET /orders/stats/orders
   */
  getOrderStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get("/orders/stats/orders");

      set({
        orderStats: res.data,
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch statistics";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw err;
    }
  },

  /**
   * Get Delivery Statistics (Admin)
   * GET /orders/stats/delivery
   */
  getDeliveryStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get("/orders/stats/delivery");

      set({
        deliveryStats: res.data.data,
        isLoading: false,
      });

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch delivery stats";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw err;
    }
  },

  // ==================== UTILITY ACTIONS ====================

  /**
   * Clear current order
   */
  clearCurrentOrder: () => set({ currentOrder: null, orderTracking: null }),

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Reset store
   */
  resetStore: () =>
    set({
      orders: [],
      currentOrder: null,
      orderTracking: null,
      orderStats: null,
      deliveryStats: null,
      checkoutSessionUrl: null,
      isLoading: false,
      isCreatingOrder: false,
      isUpdating: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
}));

// ==================== HELPER FUNCTIONS ====================

/**
 * Get status color for UI
 */
export const getOrderStatusColor = (status) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    FAILED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    REFUNDED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get status label for UI
 */
export const getOrderStatusLabel = (status) => {
  const labels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    DELIVERED: "Delivered",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };
  return labels[status] || status;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = "EGP") => {
  if (amount === undefined || amount === null) return "EGP 0";

  const currencyMap = {
    EGP: "EGP",
    egp: "EGP",
    USD: "$",
    usd: "$",
    EUR: "€",
    eur: "€",
  };

  const symbol = currencyMap[currency] || currency;
  const formattedAmount = new Intl.NumberFormat("en-US").format(amount);

  if (symbol === "$" || symbol === "€") {
    return `${symbol}${formattedAmount}`;
  }
  return `${symbol} ${formattedAmount}`;
};

/**
 * Format date
 */
export const formatOrderDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default useOrderStore;