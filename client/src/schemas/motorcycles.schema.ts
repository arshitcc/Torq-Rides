import { z } from "zod";

export const addMotorcycleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  availableInCities: z.array(
    z.object({
      branch: z.string().min(1, "Branch is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
  pricePerDayMonThu: z.number().min(0, "Weekday price must be positive"),
  pricePerDayFriSun: z.number().min(0, "Weekend price must be positive"),
  pricePerWeek: z.number().min(0, "Weekly price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categories: z.array(
    z.enum(
      [
        "TOURING",
        "CRUISER",
        "ADVENTURE",
        "SCOOTER",
        "SUPERBIKE",
        "ELECTRIC",
        "OTHER",
      ],
      {
        required_error: "Category is required",
      }
    )
  ),
  variant: z.string().min(1, "Variant is required"),
  color: z.string().min(1, "Color is required"),
  securityDeposit: z.number().min(0, "Security deposit must be positive"),
  kmsLimitPerDay: z.number().min(1, "KMS limit per day must be positive"),
  extraKmsCharges: z.number().min(0, "Extra KMS charges must be positive"),
  specs: z.object({
    engine: z.number().min(1, "Engine specification is required"),
    power: z.number().min(1, "Power specification is required"),
    weight: z.number().min(1, "Weight specification is required"),
    seatHeight: z.number().min(1, "Seat height specification is required"),
  }),
});

export const updateMotorcycleSchema = z.object({
  make: z.string().min(1, "Make is required").optional(),
  vehicleModel: z.string().min(1, "Model is required").optional(),
  availableInCities: z
    .array(
      z.object({
        branch: z.string().min(1, "Branch is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .optional(),
  pricePerDayMonThu: z
    .number()
    .min(0, "Weekday price must be positive")
    .optional(),
  pricePerDayFriSun: z
    .number()
    .min(0, "Weekend price must be positive")
    .optional(),
  pricePerWeek: z.number().min(0, "Weekly price must be positive").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  category: z
    .enum([
      "TOURING",
      "SUPERBIKE",
      "CRUISER",
      "ADVENTURE",
      "SCOOTER",
      "ELECTRIC",
      "OTHER",
    ])
    .optional(),
  variant: z.string().min(1, "Variant is required").optional(),
  color: z.string().min(1, "Color is required").optional(),
  securityDeposit: z
    .number()
    .min(0, "Security deposit must be positive")
    .optional(),
  kmsLimitPerDay: z
    .number()
    .min(1, "KMS limit per day must be positive")
    .optional(),
  extraKmsCharges: z
    .number()
    .min(0, "Extra KMS charges must be positive")
    .optional(),
  availableQuantity: z
    .number()
    .min(1, "Available quantity must be at least 1")
    .optional(),
  specs: z
    .object({
      engine: z.number().min(1, "Engine specification is required").optional(),
      power: z.number().min(1, "Power specification is required").optional(),
      weight: z.number().min(1, "Weight specification is required").optional(),
      seatHeight: z
        .number()
        .min(1, "Seat height specification is required")
        .optional(),
    })
    .optional(),
});

export type AddMotorcycleFormData = z.infer<typeof addMotorcycleSchema>;
export type UpdateMotorcycleFormData = z.infer<typeof updateMotorcycleSchema>;
