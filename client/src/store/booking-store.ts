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
  createBooking: (data: any) => Promise<boolean>;
  modifyBooking: (bookingId: string, data: any) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
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
      set({ bookings: data, metadata, loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch bookings",
      });
      throw error;
    }
  },

  createBooking: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.createBooking(data);
      const newBooking = response.data;
      if (response.data.success) {
        set((state) => ({
          bookings: [...state.bookings, newBooking],
          loading: false,
        }));
        return true;
      }
      return false;
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create booking",
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
}));
