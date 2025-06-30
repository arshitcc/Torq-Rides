import { LoginFormData, SignupFormData } from "@/schemas";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 120000,
});

export const authAPI = {
  register: (data: SignupFormData) => api.post("/users/register", data),
  login: (data: LoginFormData) => api.post("/users/login", data),
  logout: () => api.post("/users/logout"),
  getCurrentUser: () => api.get("/users"),
};

export const motorcycleAPI = {
  getAllMotorcycles: (params?: any) => api.get("/motorcycles", { params }),
  addMotorcycle: (data: any) => api.post("/motorcycles", data),
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
  addNewReviewToMotorcycleById: (motorcycleId: string, data: any) =>
    api.post(`/reviews/${motorcycleId}`, data),
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

export default api;
