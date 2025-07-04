import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Cart } from "@/types";
import { cartAPI } from "@/lib/api";
import { AddToCartFormData } from "@/schemas/cart.schema";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // API functions
  getUserCart: () => Promise<void>;
  addOrUpdateMotorcycleToCart: (
    motorcycleId: string,
    data: AddToCartFormData
  ) => Promise<void>;
  removeMotorcycleFromCart: (motorcycleId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  applyCoupon: (couponCode: string) => Promise<void>;
  removeCouponFromCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,
      setCart: (cart) => set({ cart, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // API functions
      getUserCart: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cartAPI.getUserCart();
          const cart = response.data.data;
          set({ cart, loading: false });
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to get cart",
          });
          throw error;
        }
      },

      addOrUpdateMotorcycleToCart: async (motorcycleId, data) => {
        set({ loading: true, error: null });
        try {
          const response = await cartAPI.addOrUpdateMotorcycleToCart(
            motorcycleId,
            data
          );

          const cart = response.data.data;
          set({ cart, loading: false });
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to add to cart",
          });
          throw error;
        }
      },

      removeMotorcycleFromCart: async (motorcycleId) => {
        set({ loading: true, error: null });
        try {
          const response = await cartAPI.removeMotorcycleFromCart(motorcycleId);
          const cart = response.data.data;
          set({ cart, loading: false });
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error:
              error.response?.data?.message || "Failed to remove from cart",
          });
          throw error;
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          await cartAPI.clearCart();
          set({ cart: null, loading: false });
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to clear cart",
          });
          throw error;
        }
      },

      applyCoupon: async (couponCode) => {
        set({ loading: true, error: null });
        try {
          const response = await cartAPI.applyCoupon({ couponCode });
          const cart = response.data.data;
          set({ loading: false, cart: response.data.data });
          if (cart.cartTotal < cart.discountedTotal) {
            toast.success(
              `Coupon Applied. Discount: ${
                cart.discountedTotal - cart.cartTotal
              }`
            );
          }
        } catch (error : AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to apply coupon",
          });
          throw error;
        }
      },

      removeCouponFromCart: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cartAPI.removeCouponFromCart();
          const cart = response.data.data;
          set({ loading: false, cart });
        } catch (error : AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to remove coupon",
          });
          throw error;
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
