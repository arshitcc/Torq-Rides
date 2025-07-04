import { z } from "zod";
import { MotorcycleStatusEnum } from "@/types";

// Things-to-do sub-object schema
const thingsToDoSchema = z.object({
  odoReading: z
    .number({ invalid_type_error: "odoReading must be a number" })
    .nonnegative(),
  scheduledService: z.boolean().optional(),
  brakePads: z.boolean().optional(),
  chainSet: z.boolean().optional(),
  damageRepair: z.boolean().optional(),
  damageDetails: z.string().trim().optional(),
  clutchWork: z.boolean().optional(),
  clutchDetails: z.string().trim().optional(),
  other: z.boolean().optional(),
  otherDetails: z.string().trim().optional(),
});

export const createMotorcycleLogSchema = z.object({
  motorcycleId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "motorcycleId must be a valid ObjectId"),
  dateIn: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "dateIn must be a valid ISO 8601 date string",
    })
    .transform((val) => new Date(val)),
  serviceCentreName: z.string().trim().min(1, "serviceCentreName is required"),
  thingsToDo: thingsToDoSchema,
  status: z.nativeEnum(MotorcycleStatusEnum).optional(),
  dateOut: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "dateOut must be a valid ISO 8601 date string",
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  billAmount: z.number().optional(),
  isAvailable: z.boolean().optional(),
});

export const updateMotorcycleLogSchema = createMotorcycleLogSchema.partial();

export type CreateMotorcycleLogFormData = z.infer<
  typeof createMotorcycleLogSchema
>;
export type UpdateMotorcycleLogFormData = z.infer<
  typeof updateMotorcycleLogSchema
>;
