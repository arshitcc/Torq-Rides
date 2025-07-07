import { z } from "zod";

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
      required_error: " is required",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: " must be after pickup date",
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
  rentPerDay: z.number().min(1, "Price must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["TOURING", "SPORTS", "CRUISER", "ADVENTURE", "SCOOTER"]),
  specs: z.record(z.string(), z.string()),
  images: z.array(z.string()).min(1, "At least one image is required"),
  documents: z.array(z.string()).min(1, "At least one document is required"),
  availableQuantity: z.number().min(1, "Quantity must be at least 1"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type AddMotorcycleFormData = z.infer<typeof addMotorcycleSchema>;
