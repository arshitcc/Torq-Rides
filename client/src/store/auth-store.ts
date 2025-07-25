import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { User } from "@/types";
import {
  AssignRoleFormData,
  ChangeCurrentPasswordFormData,
  ForgotPasswordFormData,
  LoginFormData,
  ResetPasswordFormData,
  SignupFormData,
  UpdateProfileFormData,
  UploadDocumentFormData,
} from "@/schemas/users.schema";

interface AuthState {
  isAuthenticated: boolean;
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (
    user: User | null,
    isAuthenticated?: boolean,
    loading?: boolean,
    error?: string | null
  ) => void;
  setUsers: (users: User[]) => void;
  getCurrentUser: () => Promise<void>;
  register: (data: SignupFormData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  forgotPasswordRequest: (data: ForgotPasswordFormData) => Promise<void>;
  resetForgottenPassword: (
    token: string,
    data: ResetPasswordFormData
  ) => Promise<void>;
  changeAvatar: (file: File, old_avatar_public_id?: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  changeCurrentPassword: (data: ChangeCurrentPasswordFormData) => Promise<void>;
  uploadDocument: (data: UploadDocumentFormData, file: File) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  assignRole: (userId: string, data: AssignRoleFormData) => Promise<void>;
  updateUserProfile: (data: UpdateProfileFormData) => Promise<void>;
  getAllUsers: (params?: any) => Promise<void>;
  deleteUserDocument: (documentId: string) => Promise<void>;
}

export const initialAuthState = {
  users: [],
  metadata: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialAuthState,
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setUser: (user, isAuthenticated, loading, error) =>
        set({ user, isAuthenticated, loading, error }),
      setUsers: (users) => set({ users }),

      getCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.getCurrentUser();
          set({ user: response.data.data, isAuthenticated: true });
        } catch (error: AxiosError | any) {
          set({
            user: null,
            isAuthenticated: false,
            error: error.response?.data?.message || "Failed to get user",
          });
          toast.error(error.response?.data?.message || "Failed to get user");
        } finally {
          set({ loading: false });
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          await authAPI.register(data);
          set({ error: null });
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Registration failed",
          });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.login(data);
          if (res.data.success) {
            set({ user: res.data.data, isAuthenticated: true });
            toast.success(res.data.message);
          }
        } catch (error: AxiosError | any) {
          set({ error: error.response?.data?.message || "Login failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await authAPI.logout();
          window.localStorage.clear();
          set({ user: null, isAuthenticated: false });
        } catch (error: AxiosError | any) {
          set({ error: error.response?.data?.message || "Logout failed" });
          toast.error(error.response?.data?.message || "Logout failed");
        } finally {
          set({ loading: false });
        }
      },

      verifyEmail: async (token) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.verifyEmail(token);
          toast.success(res.data.message);
          await get().getCurrentUser();
          return true;
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Verify email failed",
          });
          toast.error(error.response?.data?.message || "Verify email failed");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      forgotPasswordRequest: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.forgotPasswordRequest(data);
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Forgot password failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      resetForgottenPassword: async (token, data) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.resetForgottenPassword(token, data);
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Reset password failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      changeAvatar: async (file, old_avatar_public_id) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("avatar", file);
          if (old_avatar_public_id)
            formData.append("old_avatar_public_id", old_avatar_public_id);

          const response = await authAPI.changeAvatar(formData);
          set({ user: response.data.data, loading: false, error: null });
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Change avatar failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      resendEmailVerification: async () => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.resendVerificationEmail();
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Resend email failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      changeCurrentPassword: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.changeCurrentPassword(data);
          toast.success(res.data.message || "Password changed");
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Change password failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      uploadDocument: async (data, file) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("document", file);
          formData.append("type", data.type);
          if (data.name) formData.append("name", data.name);
          const res = await authAPI.uploadDocument(formData);
          set((state) => ({ user: res.data.data }));
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Upload document failed",
          });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      deleteUserAccount: async (userId) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.deleteUserAccount(userId);
          toast.success(res.data.message);
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Delete account failed",
          });
          toast.error(error.response?.data?.message || "Delete account failed");
        } finally {
          set({ loading: false });
        }
      },

      assignRole: async (userId, data) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.assignRole(userId, data);
          toast.success(res.data.message);
        } catch (error: AxiosError | any) {
          set({ error: error.response?.data?.message || "Assign role failed" });
          toast.error(error.response?.data?.message || "Assign role failed");
        } finally {
          set({ loading: false });
        }
      },

      updateUserProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.updateUserProfile(data);
          if (res.data.data.role === "USER") set({ users: [] });
          set({ user: res.data.data });
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Update profile failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      getAllUsers: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.getAllUsers(params);
          const { data, metadata } = res.data.data;
          set({ users: data, metadata: metadata[0] });
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Get users failed",
          });
        } finally {
          set({ loading: false });
        }
      },

      deleteUserDocument: async (documentId) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.deleteUserDocument(documentId);
          set((state) => {
            if (!state.user)
              return { loading: false, error: "Something Went Wrong !!" };
            return {
              ...state,
              user: {
                ...state.user,
                documents: state.user.documents.filter(
                  (doc) => doc._id !== documentId
                ),
              },
            };
          });
        } catch (error: AxiosError | any) {
          set({
            error: error.response?.data?.message || "Delete document failed",
          });
          toast.error(
            error.response?.data?.message || "Delete document failed"
          );
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: "auth-storage" }
  )
);
