import { z } from "zod";

export const couponSchema = z.object({
  name: z.string().min(1, "Coupon name is required"),
  promoCode: z.string().min(3, "Promo code must be at least 3 characters"),
  type: z.enum(["FLAT", "PERCENTAGE"]),
  discountValue: z.number().min(0, "Discount value must be positive"),
  startDate: z.date(),
  expiryDate: z.date(),
  isActive: z.boolean(),
  minimumCartValue: z.number().min(0, "Minimum order value must be positive"),
});

export const updateCouponSchema = z.object({
  name: z.string().min(1, "Coupon name is required").optional(),
  promoCode: z
    .string()
    .min(3, "Promo code must be at least 3 characters")
    .optional(),
  type: z.enum(["FLAT", "PERCENTAGE"]).optional(),
  discountValue: z
    .number()
    .min(0, "Discount value must be positive")
    .optional(),
  startDate: z.date().optional(),
  expiryDate: z.date().optional(),
  isActive: z.boolean().default(true).optional(),
  minimumCartValue: z
    .number()
    .min(0, "Minimum order value must be positive")
    .optional(),
});

export type CouponFormData = z.infer<typeof couponSchema>;
export type UpdateCouponFormData = z.infer<typeof updateCouponSchema>;
