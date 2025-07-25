import { create } from "zustand";
import { motorcycleAPI } from "@/lib/api";
import { Motorcycle, MotorcycleCategory, MotorcycleLog } from "@/types";
import {
  CreateMotorcycleLogFormData,
  UpdateMotorcycleLogFormData,
} from "@/schemas/motorcycle-logs.schema";
import { AxiosError } from "axios";

interface MotorcycleState {
  filters: {
    makes: string[];
    models: string[];
    categories: string[];
    distinctCities: string[];
    selectedCities: string[];
    selectedMake: string;
    selectedCategory: MotorcycleCategory | "All Categories";
  };
  motorcycles: Motorcycle[];
  motorcycle: Motorcycle | null;
  logs: MotorcycleLog[];
  loading: boolean;
  error: string | null;
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  setMotorcycle: (motorcycle: Motorcycle) => void;
  setMotorcycles: (motorcycles: Motorcycle[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMetadata: (metadata: any) => void;
  setFilters: (filters: any) => void;

  // API functions
  getAllMotorcycles: (params?: any) => Promise<void>;
  fetchMoreMotorcycles: (params?: any) => Promise<void>;
  addMotorcycle: (data: FormData) => Promise<void>;
  getMotorcycleById: (motorcycleId: string) => Promise<Motorcycle>;
  updateMotorcycleDetails: (motorcycleId: string, data: any) => Promise<void>;
  updateMotorcycleAvailability: (
    motorcycleId: string,
    data: { isAvailable: boolean }
  ) => Promise<void>;
  deleteMotorcycle: (motorcycleId: string) => Promise<void>;
  deleteMotorcycleImage: (
    motorcycleId: string,
    imageId: string
  ) => Promise<void>;
  getAllFilters: () => Promise<void>;

  // MotorcycleLogs API Functions
  getAllMotorcycleLogs: () => Promise<void>;
  createMotorcycleLog: (
    motorcycleId: string,
    data: CreateMotorcycleLogFormData
  ) => Promise<void>;
  getMotorcycleLogs: (motorcycleId: string) => Promise<void>;
  updateMotorcycleLog: (
    motorcycleId: string,
    logId: string,
    data: UpdateMotorcycleLogFormData
  ) => Promise<void>;
  deleteMotorcycleLog: (motorcycleId: string, logId: string) => Promise<void>;
}

export const useMotorcycleStore = create<MotorcycleState>((set, get) => ({
  filters: {
    makes: [],
    models: [],
    categories: [],
    distinctCities: [],
    selectedCities: [],
    selectedMake: "All Makes",
    selectedCategory: "All Categories",
  },
  motorcycles: [],
  motorcycle: null,
  logs: [],
  loading: false,
  error: null,
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  setMotorcycles: (motorcycles) => set({ motorcycles }),
  setMotorcycle: (motorcycle) => set({ motorcycle }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMetadata: (metadata) => set({ metadata }),
  setFilters: (filters) => set({ filters }),

  // Mortorcycle API functions
  getAllMotorcycles: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getAllMotorcycles(params);
      const { data, metadata } = response.data.data;
      set({ motorcycles: data, metadata: metadata[0], loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch motorcycles",
      });
      throw error;
    }
  },

  fetchMoreMotorcycles: async (params) => {
    set({ error: null });
    try {
      const response = await motorcycleAPI.getAllMotorcycles(params);
      const { data, metadata } = response.data.data;
      set((state) => ({
        motorcycles: [...state.motorcycles, ...(data || [])],
        metadata: metadata?.[0],
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to fetch more motorcycles",
      });
      throw error;
    }
  },

  addMotorcycle: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.addMotorcycle(data);
      const newMotorcycle = response.data.data;
      set((state) => ({
        motorcycles: [newMotorcycle, ...state.motorcycles],
        loading: false,
      }));
    } catch (error: AxiosError | any) {
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
      const motorcycle = response.data.data;
      set({ loading: false, motorcycle });
      return response.data;
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message ?? "Failed to fetch motorcycle",
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
      const updatedMotorcycle = response.data.data;
      set((state) => ({
        motorcycles: state.motorcycles.map((m) =>
          m._id === motorcycleId ? updatedMotorcycle : m
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update motorcycle",
      });
      throw error;
    }
  },

  updateMotorcycleAvailability: async (motorcycleId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await motorcycleAPI.updateMotorcycleAvailability(
        motorcycleId,
        data
      );
      set((state) => ({
        motorcycles: state.motorcycles.map((m) =>
          m._id === motorcycleId ? res.data.data : m
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message ?? "Failed to update motorcycle",
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
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete motorcycle",
      });
      throw error;
    }
  },

  deleteMotorcycleImage: async (motorcycleId, imageId) => {
    set({ loading: true, error: null });
    try {
      await motorcycleAPI.deleteMotorcycleImage(motorcycleId, imageId);
      set((state) => ({
        "motorcycle?.images": state.motorcycle?.images.filter(
          (img) => img.public_id !== imageId
        ),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to delete motorcycle log",
      });
      throw error;
    }
  },

  getAllFilters: async () => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getAllFilters();
      const filters = response.data.data;
      set({ filters, loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to fetch motorcycle logs",
      });
      throw error;
    }
  },

  // Motorcycle Log API functions

  getAllMotorcycleLogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getAllMotorcycleLogs();
      const { data } = response.data.data;
      set({ motorcycles: data, loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to fetch motorcycle logs",
      });
      throw error;
    }
  },

  createMotorcycleLog: async (motorcycleId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.createMotorcycleLog(
        motorcycleId,
        data
      );
      const newMotorcycleLog = response.data;
      set((state) => ({
        motorcycles: [...state.motorcycles, newMotorcycleLog],
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to create motorcycle log",
      });
      throw error;
    }
  },

  getMotorcycleLogs: async (motorcycleId) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getMotorcycleLogs(motorcycleId);
      const { data } = response.data.data;
      set({ motorcycles: data, loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to fetch motorcycle logs",
      });
      throw error;
    }
  },

  updateMotorcycleLog: async (motorcycleId, logId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.updateMotorcycleLog(logId, data);
      const updatedMotorcycleLog: MotorcycleLog = response.data.data;
      set((state) => ({
        logs: state.logs.map((log) =>
          log._id === updatedMotorcycleLog._id ? updatedMotorcycleLog : log
        ),
        loading: false,
        error: null,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to update motorcycle log",
      });
      throw error;
    }
  },

  deleteMotorcycleLog: async (logId) => {
    set({ loading: true, error: null });
    try {
      await motorcycleAPI.deleteMotorcycleLog(logId);
      set((state) => ({
        logs: state.logs.filter((log) => log._id !== logId),
        loading: false,
      }));
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to delete motorcycle log",
      });
      throw error;
    }
  },
}));
