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

export const searchRidesSchema = z.object({
  pickupLocation: z.string().min(2, "Pickup location is required"),
  dropoffLocation: z.string().min(2, "Dropoff location is required").optional(),
  pickupDate: z.date({
    required_error: "Pickup date is required",
  }),
  dropoffDate: z.date({
    required_error: "Dropoff date is required",
  }),
  pickupTime: z.string().min(4, "Pickup time is required").optional(),
  dropoffTime: z.string().min(4, "Dropoff time is required").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type SearchRidesFormData = z.infer<typeof searchRidesSchema>;
