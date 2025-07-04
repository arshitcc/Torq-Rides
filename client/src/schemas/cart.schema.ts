import { z } from "zod";

export const addToCartSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pickupDate: z.date({
    required_error: "Pickup date is required",
  }),
  returnDate: z.date({
    required_error: "Return date is required",
  }),
});

export type AddToCartFormData = z.infer<typeof addToCartSchema>;
