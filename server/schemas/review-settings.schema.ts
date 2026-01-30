import { z } from "zod";

/**
 * Review Settings Validation Schema
 * Used for admin settings page form validation
 * All fields have defaults - undefined inputs are accepted and converted to defaults
 */
export const reviewSettingsSchema = z.object({
  // General Settings
  reviewsEnabled: z.boolean().default(true),
  requireOrderSucceeded: z.boolean().default(true),
  oneReviewPerOrder: z.boolean().default(true),
  reviewWindowDays: z.number().int().min(1).max(365).default(30),
  moderationRequired: z.boolean().default(true),

  // Magic Link Settings
  tokenExpiryHours: z.number().int().min(1).max(8760).default(720), // Max 1 year
  allowTokenRegenerate: z.boolean().default(true),
  waTemplate: z
    .string()
    .min(10)
    .max(500)
    .default(
      "Halo {customerName}! Terima kasih atas pesanan {orderCode}. Kami ingin mendengar pengalaman Anda. Klik link ini untuk memberi review: {reviewLink}"
    ),

  // Smart Popup Settings
  popupEnabled: z.boolean().default(true),
  popupMinSessions: z.number().int().min(1).max(50).default(2),
  popupMinDaysSinceFirstSeen: z.number().int().min(0).max(365).default(3),
  popupMinSecondsOnSite: z.number().int().min(0).max(600).default(45),
  popupCooldownDays: z.number().int().min(1).max(365).default(14),
  popupMaxImpressionsPerWindow: z.number().int().min(1).max(20).default(3),
  popupOnlyIfEligibleOrdersExist: z.boolean().default(true),

  // Popup Copy
  popupTitle: z.string().min(5).max(100).default("Bagaimana pengalaman Anda?"),
  popupBody: z
    .string()
    .min(10)
    .max(300)
    .default("Kami ingin mendengar pendapat Anda tentang toko kami!"),
  successMessage: z
    .string()
    .min(10)
    .max(200)
    .default("Terima kasih atas review Anda!"),

  // My Orders Settings
  myOrdersReviewEnabled: z.boolean().default(true),
  showReviewForLastNOrders: z.number().int().min(1).max(50).default(5),
  allowResubmitOnRejected: z.boolean().default(false),

  // Validation Settings
  ratingRequired: z.boolean().default(true),
  minMessageLength: z.number().int().min(0).max(1000).default(10),
  maxMessageLength: z.number().int().min(10).max(5000).default(300),
});

export type ReviewSettingsInput = z.infer<typeof reviewSettingsSchema>;
