import { z } from "zod";

/**
 * Testimonial Submission Schema
 * Used when users submit reviews from My Orders or other channels
 */
export const testimonialSubmissionSchema = z.object({
  orderId: z.string().cuid("Invalid order ID"),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10).max(500),
  source: z.enum(["MY_ORDERS", "MAGIC_LINK", "POPUP"]),
});

export type TestimonialSubmission = z.infer<
  typeof testimonialSubmissionSchema
>;
