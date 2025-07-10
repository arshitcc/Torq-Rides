import { create } from "zustand";
import { motorcycleAPI } from "@/lib/api";
import type { MotorcycleLog } from "@/types";
import { AxiosError } from "axios";

interface MotorcycleLogState {
  logs: MotorcycleLog[];
  loading: boolean;
  error: string | null;
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  setLogs: (logs: MotorcycleLog[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMetadata: (metadata: any) => void;

  // API functions
  getAllMotorcycleLogs: (params?: any) => Promise<void>;
  getMotorcycleLogs: (motorcycleId: string, params?: any) => Promise<void>;
  createMotorcycleLog: (motorcycleId: string, data: any) => Promise<void>;
  updateMotorcycleLog: (
    motorcycleId: string,
    logId: string,
    data: any
  ) => Promise<void>;
  deleteMotorcycleLog: (motorcycleId: string, logId: string) => Promise<void>;
}

export const useMotorcycleLogStore = create<MotorcycleLogState>((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  setLogs: (logs) => set({ logs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMetadata: (metadata) => set({ metadata }),

  // API functions

  getAllMotorcycleLogs: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getAllMotorcycleLogs(params);
      const { data, metadata } = response.data.data;
      set({ logs: data, metadata: metadata[0], loading: false });
    } catch (error: AxiosError | any) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to fetch motorcycle logs",
      });
      throw error;
    }
  },

  getMotorcycleLogs: async (motorcycleId, params) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.getMotorcycleLogs(
        motorcycleId,
        params
      );
      const { data, metadata } = response.data;
      set({ logs: data, metadata, loading: false });
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
      const newLog = response.data.data;
      set((state) => ({
        logs: [newLog, ...state.logs],
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

  updateMotorcycleLog: async (motorcycleId, logId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await motorcycleAPI.updateMotorcycleLog(
        motorcycleId,
        logId,
        data
      );
      const updatedLog = response.data.data;
      set((state) => ({
        logs: state.logs.map((log) => (log._id === logId ? updatedLog : log)),
        loading: false,
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

  deleteMotorcycleLog: async (motorcycleId, logId) => {
    set({ loading: true, error: null });
    try {
      await motorcycleAPI.deleteMotorcycleLog(motorcycleId, logId);
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
