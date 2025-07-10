import { z } from "zod";

export const addMotorcycleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1),
  registrationNumber: z.string(),
  availableInCities: z.array(z.string()),
  rentPerDay: z.number().min(0, "Rent per day must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["TOURING", "SPORTS", "CRUISER", "ADVENTURE", "SCOOTER"], { required_error: "Category is required" }),
  variant: z.string().min(1, "Variant is required"),
  color: z.string().min(1, "Color is required"),
  securityDeposit: z.number().min(0, "Security deposit must be positive"),
  kmsLimitPerDay: z.number().min(1, "KMS limit per day must be positive"),
  extraKmsCharges: z.number().min(0, "Extra KMS charges must be positive"),
  availableQuantity: z.number().min(1, "Available quantity must be at least 1"),
  specs: z.object({
    engine: z.string().min(1, "Engine specification is required"),
    power: z.string().min(1, "Power specification is required"),
    weight: z.string().min(1, "Weight specification is required"),
  }),
  isAvailable: z.boolean(),
});

export const updateMotorcycleSchema = z.object({
  make: z.string().min(1, "Make is required").optional(),
  vehicleModel: z.string().min(1, "Model is required").optional(),
  year: z
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1)
    .optional(),
  registrationNumber: z.string().optional(),
  availableInCities: z.array(z.string()).optional(),
  rentPerDay: z.number().min(0, "Rent per day must be positive").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  category: z
    .enum(["TOURING", "SPORTS", "CRUISER", "ADVENTURE", "SCOOTER"])
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
      engine: z.string().min(1, "Engine specification is required").optional(),
      power: z.string().min(1, "Power specification is required").optional(),
      weight: z.string().min(1, "Weight specification is required").optional(),
    })
    .optional(),
  isAvailable: z.boolean().optional(),
});

export type AddMotorcycleFormData = z.infer<typeof addMotorcycleSchema>;
export type UpdateMotorcycleFormData = z.infer<typeof updateMotorcycleSchema>;
