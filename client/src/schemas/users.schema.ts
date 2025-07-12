import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  user: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullname: z.string().min(3, "Full name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateProfileSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Document Upload Schema
export const uploadDocumentSchema = z.object({
  type: z.enum(["E-KYC", "PAN-CARD", "AADHAR-CARD", "DRIVING-LICENSE"], {
    required_error: "Valid Document type is required",
  }),
  name: z.string().optional(),
});

// Password change schema (updated to match backend validation)
export const changeCurrentPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Old password must be at least 8 characters")
    .max(50, "Password must be maximum 50 characters"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(50, "Password must be maximum 50 characters"),
  confirmNewPassword: z.string().min(8, "Please confirm your new password"),
});

// Forgot password request schema
export const forgotPasswordRequestSchema = z.object({
  user: z
    .string()
    .min(5, "Username or Email must be at least 5 characters")
    .max(60, "Username or Email must be maximum 60 characters"),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be maximum 50 characters"),
});

export const assignRoleSchema = z.object({
  role: z.enum(["ADMIN", "CUSTOMER", "SUPPORT"]),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;
export type ChangeCurrentPasswordFormData = z.infer<
  typeof changeCurrentPasswordSchema
>;
export type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordRequestSchema
>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type AssignRoleFormData = z.infer<typeof assignRoleSchema>;
