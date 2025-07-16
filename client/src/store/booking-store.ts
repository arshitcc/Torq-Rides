import { create } from "zustand";
import { bookingAPI } from "@/lib/api";
import { Booking } from "@/types";
import { AxiosError, AxiosResponse } from "axios";

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  setBookings: (bookings: Booking[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMetadata: (metadata: any) => void;
  // API functions
  getAllBookings: (params?: any) => Promise<void>;
  modifyBooking: (bookingId: string, data: any) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;

  // Payment Functions :
  generateRazorpayOrder: (mode: string) => Promise<void>;
  verifyRazorpayPayment: (data: {
    razorpay_payment_id: string;
    razorpay_signature: string;
    razorpay_order_id: string;
  }) => Promise<Booking>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  setBookings: (bookings) => set({ bookings }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMetadata: (metadata) => set({ metadata }),

  // API functions
  getAllBookings: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.getAllBookings(params);
      const { data, metadata } = response.data.data;
      set({ bookings: data, metadata: metadata[0], loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch bookings",
      });
      throw error;
    }
  },

  modifyBooking: async (bookingId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.modifyBooking(bookingId, data);
      const { modifiedBooking, customer } = response.data.data;
      const updatedBooking = {
        ...modifiedBooking,
        customer,
      };
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? updatedBooking : b
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to modify booking",
      });
      throw error;
    }
  },

  cancelBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.cancelBooking(bookingId);
      const { updatedBooking, customer } = response.data.data;
      const canceledBooking = {
        ...updatedBooking,
        customer,
      };
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? canceledBooking : b
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to cancel booking",
      });
      throw error;
    }
  },

  generateRazorpayOrder: async (mode) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.generateRazorpayOrder(mode);
      const order = response.data.data;
      return order;
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to generate razorpay order",
      });
      throw error;
    }
  },

  verifyRazorpayPayment: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.verifyRazorpayOrder(data);
      const order = response.data.data;
      return order;
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to verify razorpay order",
      });
      throw error;
    }
  },
}));
