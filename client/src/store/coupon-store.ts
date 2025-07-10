import { create } from "zustand";
import { couponAPI } from "@/lib/api";
import { PromoCode } from "@/types";
import { CouponFormData, UpdateCouponFormData } from "@/schemas/coupons.schema";
import { AxiosError } from "axios";

interface PromoCodeState {
  coupons: PromoCode[];
  loading: boolean;
  error: string | null;
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  setCoupons: (coupons: PromoCode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // API functions
  getAllCoupons: () => Promise<void>;
  createCoupon: (data: CouponFormData) => Promise<void>;
  getCouponById: (couponId: string) => Promise<PromoCode>;
  updateCoupon: (couponId: string, data: UpdateCouponFormData) => Promise<void>;
  updateCouponActiveStatus: (
    couponId: string,
    isActive: boolean
  ) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
}

export const useCouponStore = create<PromoCodeState>((set, get) => ({
  coupons: [],
  loading: false,
  error: null,
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  setCoupons: (coupons) => set({ coupons }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // API functions
  getAllCoupons: async () => {
    set({ loading: true, error: null });
    try {
      const response = await couponAPI.getAllCoupons();
      const { data, metadata } = response.data.data;
      set({ coupons: data, metadata, loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch coupons",
      });
      throw error;
    }
  },

  createCoupon: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await couponAPI.createCoupon(data);
      const createdCoupon = response.data.data;
      set((state) => ({
        coupons: [createdCoupon, ...state.coupons],
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create coupon",
      });
      throw error;
    }
  },

  getCouponById: async (couponId) => {
    set({ loading: true, error: null });
    try {
      const response = await couponAPI.getCouponById(couponId);
      set({ loading: false });
      return response.data;
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch coupon",
      });
      throw error;
    }
  },

  updateCoupon: async (couponId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await couponAPI.updateCoupon(couponId, data);
      const updatedCoupon = response.data.data;
      set((state) => ({
        coupons: state.coupons.map((c) =>
          c._id === couponId ? updatedCoupon : c
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update coupon",
      });
      throw error;
    }
  },

  updateCouponActiveStatus: async (couponId, isActive) => {
    set({ loading: true, error: null });
    try {
      await couponAPI.updateCouponActiveStatus(couponId, { isActive });
      set((state) => ({
        coupons: state.coupons.map((c) =>
          c._id === couponId ? { ...c, isActive } : c
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to update coupon status",
      });
      throw error;
    }
  },

  deleteCoupon: async (couponId) => {
    set({ loading: true, error: null });
    try {
      await couponAPI.deleteCoupon(couponId);
      set((state) => ({
        coupons: state.coupons.filter((c) => c._id !== couponId),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete coupon",
      });
      throw error;
    }
  },
}));
