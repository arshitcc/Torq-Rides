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

// Contact Schema
export const contactSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  enquiryMessage: z.string().min(10, "Message must be at least 10 characters"),
});

// Booking Schema
export const bookingSchema = z
  .object({
    startDate: z.date({
      required_error: "Pickup date is required",
    }),
    endDate: z.date({
      required_error: "Return date is required",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Return date must be after pickup date",
    path: ["endDate"],
  });

// Review Schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Add Motorcycle Schema
export const addMotorcycleSchema = z.object({
  make: z.string().min(2, "Make is required"),
  vehicleModel: z.string().min(2, "Model is required"),
  year: z
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  isAvailable: z.boolean(),
  pricePerDay: z.number().min(1, "Price must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["TOURING", "SPORTS", "CRUISER", "ADVENTURE", "SCOOTER"]),
  specs: z.record(z.string(), z.string()),
});

// Coupon Schema
export const couponSchema = z
  .object({
    name: z.string().min(2, "Coupon name is required"),
    promoCode: z.string().min(3, "Promo code is required"),
    type: z.enum(["flat", "percentage"]),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    expiryDate: z.date({
      required_error: "Expiry date is required",
    }),
    discountValue: z.number().min(1, "Discount value must be greater than 0"),
    isActive: z.boolean(),
  })
  .refine((data) => data.expiryDate > data.startDate, {
    message: "Expiry date must be after start date",
    path: ["expiryDate"],
  });

export const profileSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type AddMotorcycleFormData = z.infer<typeof addMotorcycleSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
