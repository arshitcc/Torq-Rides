import { create } from "zustand";
import { motorcycleAPI } from "@/lib/api";
import { CustomerMotorcycle, AdminMotorcycle } from "@/types";

interface MotorcycleState {
  motorcycles: CustomerMotorcycle[] | AdminMotorcycle[];
  loading: boolean;
  error: string | null;
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  setMotorcycles: (
    motorcycles: CustomerMotorcycle[] | AdminMotorcycle[]
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMetadata: (metadata: any) => void;
  // API functions
  getAllMotorcycles: (params?: any) => Promise<void>;
  addMotorcycle: (data: any) => Promise<void>;
  getMotorcycleById: (motorcycleId: string) => Promise<CustomerMotorcycle>;
  updateMotorcycleDetails: (motorcycleId: string, data: any) => Promise<void>;
  updateMotorcycleMaintenanceLogs: (
    motorcycleId: string,
    data: any
  ) => Promise<void>;
  deleteMotorcycle: (motorcycleId: string) => Promise<void>;
}

export const useMotorcycleStore = create<MotorcycleState>((set, get) => ({
  motorcycles: [],
  loading: false,
  error: null,
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  setMotorcycles: (motorcycles) => set({ motorcycles }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMetadata: (metadata) => set({ metadata }),

  // API functions
  getAllMotorcycles: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getAllMotorcycles(params);
      const { data, metadata } = response.data.data;
      set({ motorcycles: data, metadata: metadata[0], loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch motorcycles",
      });
      throw error;
    }
  },

  addMotorcycle: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.addMotorcycle(data);
      const newMotorcycle = response.data;
      set((state) => ({
        motorcycles: [...state.motorcycles, newMotorcycle],
        loading: false,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to add motorcycle",
      });
      throw error;
    }
  },

  getMotorcycleById: async (motorcycleId) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getMotorcycleById(motorcycleId);
      const { data } = response.data;
      set({ loading: false, motorcycles: [data] });
      return response.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch motorcycle",
      });
      throw error;
    }
  },

  updateMotorcycleDetails: async (motorcycleId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.updateMotorcycleDetails(
        motorcycleId,
        data
      );
      const updatedMotorcycle = response.data;
      set((state) => ({
        motorcycles: state.motorcycles.map((m) =>
          m._id === motorcycleId ? updatedMotorcycle : m
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update motorcycle",
      });
      throw error;
    }
  },

  updateMotorcycleMaintenanceLogs: async (motorcycleId, data) => {
    set({ loading: true, error: null });
    try {
      await motorcycleAPI.updateMotorcycleMaintenanceLogs(motorcycleId, data);
      set({ loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to update maintenance logs",
      });
      throw error;
    }
  },

  deleteMotorcycle: async (motorcycleId) => {
    set({ loading: true, error: null });
    try {
      await motorcycleAPI.deleteMotorcycle(motorcycleId);
      set((state) => ({
        motorcycles: state.motorcycles.filter((m) => m._id !== motorcycleId),
        loading: false,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete motorcycle",
      });
      throw error;
    }
  },
}));
