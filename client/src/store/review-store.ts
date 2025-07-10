import { create } from "zustand";
import { reviewAPI } from "@/lib/api";
import { Review } from "@/types";
import { AxiosError } from "axios";

interface ReviewState {
  reviews: Review[];
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  setReviews: (reviews: Review[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // API functions
  getAllReviewsOfMotorcycleById: (motorcycleId: string) => Promise<void>;
  addNewReviewToBookingId: (bookingId: string, data: any) => Promise<void>;
  updateReviewById: (reviewId: string, data: any) => Promise<void>;
  deleteReviewById: (reviewId: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  loading: false,
  error: null,
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  setReviews: (reviews) => set({ reviews }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // API functions
  getAllReviewsOfMotorcycleById: async (motorcycleId) => {
    set({ loading: true, error: null });
    try {
      const response = await reviewAPI.getAllReviewsOfMotorcycleById(
        motorcycleId
      );
      const { data: reviews, metadata } = response.data.data;
      set({ reviews, loading: false, metadata });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch reviews",
      });
      throw error;
    }
  },

  addNewReviewToBookingId: async (bookingId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await reviewAPI.addNewReviewToBookingId(bookingId, data);
      const newReview = response.data.data;
      set((state) => ({
        reviews: [...state.reviews, newReview],
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to add review",
      });
      throw error;
    }
  },

  updateReviewById: async (reviewId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await reviewAPI.updateReviewById(reviewId, data);
      const updatedReview = response.data;
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === reviewId ? updatedReview : r
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update review",
      });
      throw error;
    }
  },

  deleteReviewById: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      await reviewAPI.deleteReviewById(reviewId);
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== reviewId),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete review",
      });
      throw error;
    }
  },
}));
