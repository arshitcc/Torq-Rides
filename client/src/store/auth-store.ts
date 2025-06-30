import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { User } from "@/types";
import { LoginFormData, SignupFormData } from "@/schemas";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  register: (data: SignupFormData) => Promise<AxiosResponse | void>;
  login: (data: LoginFormData) => Promise<AxiosResponse | void>;
  logoutUser: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      setUser: (user, token) => set({ user, error: null }),
      logout: () => set({ user: null, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register(data);

          if (response.data.success) {
            set({ loading: false, error: null });
            return response;
          } else {
            set({ loading: false, error: response.data.message });
          }
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Registration failed",
          });
          toast.error(error.response?.data?.message || "Registration failed");
        } finally {
          set({ loading: false });
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login(data);
          if (response.data.success) {
            set({
              user: response.data.data,
              isAuthenticated: true,
              error: null,
            });
            return response;
          } else {
            set({ error: response.data.message });
          }
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Login failed",
          });
          toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ loading: false });
        }
      },

      logoutUser: async () => {
        set({ loading: true });
        try {
          await authAPI.logout();
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        } catch (error: AxiosError | any) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      getCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.getCurrentUser();
          const user = response.data;
          set({ user, loading: false });
        } catch (error: AxiosError | any) {
          set({
            loading: false,
            error: error.response?.data?.message || "Failed to get user",
          });
          toast.error(error.response?.data?.message || "Failed to get user");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
