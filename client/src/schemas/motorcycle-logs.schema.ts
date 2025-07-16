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
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required"),
  branch: z.string().trim().min(1, "Branch is required"),
  dateIn: z.date().optional(),
  serviceCentreName: z.string().trim().min(1, "serviceCentreName is required"),
  thingsToDo: thingsToDoSchema,
  status: z.nativeEnum(MotorcycleStatusEnum),
  dateOut: z.date().optional(),
  billAmount: z.number().optional(),
  isAvailable: z.boolean(),
});

export const updateMotorcycleLogSchema = createMotorcycleLogSchema.partial();

export type CreateMotorcycleLogFormData = z.infer<
  typeof createMotorcycleLogSchema
>;
export type UpdateMotorcycleLogFormData = z.infer<
  typeof updateMotorcycleLogSchema
>;
