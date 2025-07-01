import {
  AddMotorcycleFormData,
  LoginFormData,
  SignupFormData,
} from "@/schemas";
import { useAuthStore } from "@/store/auth-store";
import { ApiError } from "@/types/api";
import axios from "axios";
import Router from "next/router";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 120000,
});

export const authAPI = {
  register: (data: SignupFormData) => api.post("/users/register", data),
  login: (data: LoginFormData) => api.post("/users/login", data),
  logout: () => api.post("/users/logout"),
  getCurrentUser: () => api.get("/users"),
  refreshAccessToken: () => api.post("/users/refresh-tokens"),
};

export const motorcycleAPI = {
  getAllMotorcycles: (params?: any) => api.get("/motorcycles", { params }),
  addMotorcycle: (data: AddMotorcycleFormData) =>
    api.post("/motorcycles", data),
  getMotorcycleById: (motorcycleId: string) =>
    api.get(`/motorcycles/${motorcycleId}`),
  updateMotorcycleDetails: (motorcycleId: string, data: any) =>
    api.put(`/motorcycles/${motorcycleId}`, data),
  updateMotorcycleMaintenanceLogs: (motorcycleId: string, data: any) =>
    api.patch(`/motorcycles/${motorcycleId}`, data),
  deleteMotorcycle: (motorcycleId: string) =>
    api.delete(`/motorcycles/${motorcycleId}`),
};

export const bookingAPI = {
  getAllBookings: (params?: any) => api.get("/bookings", { params }),
  createBooking: (data: any) => api.post("/bookings", data),
  modifyBooking: (bookingId: string, data: any) =>
    api.put(`/bookings/${bookingId}`, data),
  cancelBooking: (bookingId: string) => api.delete(`/bookings/${bookingId}`),
};

export const reviewAPI = {
  getAllReviewsOfMotorcycleById: (motorcycleId: string) =>
    api.get(`/reviews/${motorcycleId}`),
  addNewReviewToBookingId: (bookingId: string, data: any) =>
    api.post(`/reviews/${bookingId}`, data),
  updateReviewById: (reviewId: string, data: any) =>
    api.put(`/reviews/${reviewId}`, data),
  deleteReviewById: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
};

export const couponAPI = {
  getAllCoupons: () => api.get("/coupons"),
  getCouponById: (couponId: string) => api.get(`/coupons/${couponId}`),
  updateCoupon: (couponId: string, data: any) =>
    api.patch(`/coupons/${couponId}`, data),
  deleteCoupon: (couponId: string) => api.delete(`/coupons/${couponId}`),
};

let refreshingTokenInProgress = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.config?.url?.includes("refresh-token")) {
      useAuthStore.getState().setUser(null, false);
      Router.push("/login");
      return Promise.reject(error);
    }

    if (
      error?.response?.status === 401 &&
      !error?.config?.url?.includes("login") &&
      !refreshingTokenInProgress
    ) {
      /* Refreshing the token */
      refreshingTokenInProgress = true;

      const response = await authAPI.refreshAccessToken();

      refreshingTokenInProgress = false;

      if (!(response instanceof ApiError)) {
        return axios(error.config);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
