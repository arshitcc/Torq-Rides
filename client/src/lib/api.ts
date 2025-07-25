import {
  AssignRoleFormData,
  ChangeCurrentPasswordFormData,
  LoginFormData,
  SignupFormData,
  UpdateProfileFormData,
} from "@/schemas/users.schema";
import {
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/schemas/users.schema";
import { ApiError } from "@/types/api";
import axios from "axios";
import {
  CreateMotorcycleLogFormData,
  UpdateMotorcycleLogFormData,
} from "@/schemas/motorcycle-logs.schema";
import { CouponFormData, UpdateCouponFormData } from "@/schemas/coupons.schema";
import { initialAuthState } from "@/store/auth-store";
import { initialCartState } from "@/store/cart-store";
import {
  AddBookingFormData,
  UpdateBookingFormData,
  CancelBookingFormData,
} from "@/schemas/bookings.schema";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 120000,
});

export const authAPI = {
  getCurrentUser: () => api.get("/users"),
  register: (data: SignupFormData) => api.post("/users/register", data),
  login: (data: LoginFormData) => api.post("/users/login", data),
  logout: () => api.post("/users/logout"),
  refreshAccessToken: () => api.post("/users/refresh-tokens"),
  verifyEmail: (token: string) => api.get(`/users/verify?token=${token}`),
  forgotPasswordRequest: (data: ForgotPasswordFormData) =>
    api.post("/users/forgot-password", data),
  resetForgottenPassword: (token: string, data: ResetPasswordFormData) =>
    api.post(`/users/reset-password?token=${token}`, data),
  changeAvatar: (formData: FormData) =>
    api.post("/users/profile/change-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  resendVerificationEmail: () =>
    api.post("/users/profile/resend-verification-email"),
  changeCurrentPassword: (data: ChangeCurrentPasswordFormData) =>
    api.post("/users/profile/change-current-password", {
      oldPassword: data.currentPassword,
      ...data,
    }),
  uploadDocument: (formData: FormData) =>
    api.post("/users/profile/upload-documents", formData),
  deleteUserAccount: (userId: string) => api.delete(`/users/${userId}`),
  assignRole: (userId: string, data: AssignRoleFormData) =>
    api.post(`/users/profile/assign-role/${userId}`, data),
  getAllUsers: (params: any) => api.get("/users/all-users", { params }),
  updateUserProfile: (data: UpdateProfileFormData) =>
    api.post("/users/profile/update-profile", data),
  deleteUserDocument: (documentId: string) =>
    api.delete(`/users/profile/delete-document/${documentId}`),
};

export const motorcycleAPI = {
  getAllMotorcycles: (params?: any) => api.get("/motorcycles", { params }),

  addMotorcycle: (data: FormData) => api.post("/motorcycles", data),

  getMotorcycleById: (motorcycleId: string) =>
    api.get(`/motorcycles/${motorcycleId}`),

  updateMotorcycleDetails: (motorcycleId: string, data: any) =>
    api.put(`/motorcycles/${motorcycleId}`, data),

  updateMotorcycleAvailability: (motorcycleId: string, data: any) =>
    api.post(`/motorcycles/${motorcycleId}`, data),

  deleteMotorcycle: (motorcycleId: string) =>
    api.delete(`/motorcycles/${motorcycleId}`),

  deleteMotorcycleImage: (motorcycleId: string, imageId: string) =>
    api.patch(`/motorcycles/${motorcycleId}`, { imageId }),

  getAllFilters: () => api.get("/motorcycles/filters"),
  // Motorcycle-Logs API

  getAllMotorcycleLogs: (params?: any) =>
    api.get("/motorcycles/logs", { params }),

  createMotorcycleLog: (
    motorcycleId: string,
    data: CreateMotorcycleLogFormData
  ) => api.post(`/motorcycles/logs/${motorcycleId}`, data),

  getMotorcycleLogs: (motorcycleId: string, params?: any) =>
    api.get(`/motorcycles/logs/${motorcycleId}`, { params }),

  updateMotorcycleLog: (logId: string, data: UpdateMotorcycleLogFormData) =>
    api.put(`/motorcycles/logs/${logId}`, data),

  deleteMotorcycleLog: (logId: string) =>
    api.delete(`/motorcycles/logs/${logId}`),

  getMotorcycleLogFilters: () => api.get("/motorcycles/logs/filters"),
};

export const bookingAPI = {
  getAllBookings: (params?: any) => api.get("/bookings", { params }),

  modifyBooking: (bookingId: string, data: any) =>
    api.put(`/bookings/${bookingId}`, data),

  cancelBooking: (bookingId: string, cancellationReason: string) => api.delete(`/bookings/${bookingId}`, { data: { cancellationReason } }),

  addBookingByAdmin: (data: AddBookingFormData) => api.post("/bookings", data),

  updateBookingByAdmin: (bookingId: string, data: UpdateBookingFormData) =>
    api.put(`/bookings/${bookingId}/admin`, data),

  cancelBookingByAdmin: (
    bookingId: string,
    data: CancelBookingFormData | undefined
  ) => api.patch(`/bookings/${bookingId}/admin`, { data }),

  deleteBookingByAdmin: (bookingId: string) =>
    api.delete(`/bookings/${bookingId}/admin`),

  generateRazorpayOrder: (mode: string, bookingId?: string) =>
    api.post("/bookings/provider/razorpay", { mode, bookingId }),

  verifyRazorpayOrder: (data: {
    razorpay_payment_id: string;
    razorpay_signature: string;
    razorpay_order_id: string;
    amount: number;
    bookingId?: string;
  }) => api.post("/bookings/provider/razorpay/verify-payment", data),

  getDashboardStats: () => api.get("/bookings/stats"),
  getSalesOverview: (params?: any) =>
    api.get("/bookings/sales-overview", { params }),
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
  createCoupon: (data: CouponFormData) => api.post("/coupons", data),
  getCouponById: (couponId: string) => api.get(`/coupons/${couponId}`),
  updateCoupon: (couponId: string, data: UpdateCouponFormData) =>
    api.put(`/coupons/${couponId}`, data),
  updateCouponActiveStatus: (couponId: string, data: { isActive: boolean }) =>
    api.patch(`/coupons/${couponId}`, data),
  deleteCoupon: (couponId: string) => api.delete(`/coupons/${couponId}`),
};

export const cartAPI = {
  getUserCart: () => api.get("/carts"),
  addOrUpdateMotorcycleToCart: (motorcycleId: string, data: any) =>
    api.post(`/carts/item/${motorcycleId}`, data),
  removeMotorcycleFromCart: (motorcycleId: string) =>
    api.delete(`/carts/item/${motorcycleId}`),
  clearCart: () => api.delete("/carts/clear"),

  applyCoupon: (data: { couponCode: string }) =>
    api.post("/coupons/c/apply", data),
  removeCouponFromCart: () => api.post("/coupons/c/remove"),
};

let refreshingTokenInProgress = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.config?.url?.includes("refresh-token")) {
      localStorage.setItem("auth-storage", JSON.stringify(initialAuthState));
      localStorage.setItem("cart-storage", JSON.stringify(initialCartState));
      window.location.href = "/login";
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
