"use server";

import prisma from "@/lib/db/prisma";
import { reviewSettingsSchema, ReviewSettingsInput } from "@/server/schemas/review-settings.schema";
import { revalidatePath } from "next/cache";

/**
 * Get current review system settings
 * Returns first record or null if not exists
 */
export async function getReviewSettings() {
  try {
    const settings = await prisma.reviewSettings.findFirst();
    return { success: true, data: settings };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to fetch review settings";
    return { success: false, error: errorMessage };
  }
}

/**
 * Update review system settings
 * Creates new record if doesn't exist (upsert)
 */
export async function updateReviewSettings(data: ReviewSettingsInput) {
  try {
    // Validate input
    const validatedData = reviewSettingsSchema.parse(data);

    // Get existing settings to determine upsert
    const existing = await prisma.reviewSettings.findFirst();

    let updated;
    if (existing) {
      // Update existing
      updated = await prisma.reviewSettings.update({
        where: { id: existing.id },
        data: validatedData,
      });
    } else {
      // Create new
      updated = await prisma.reviewSettings.create({
        data: validatedData,
      });
    }

    revalidatePath("/dashboard/settings/reviews");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to update review settings";
    return { success: false, error: errorMessage };
  }
}

/**
 * Get settings with defaults if not exists
 * Returns default values if no settings in database
 */
export async function getReviewSettingsWithDefaults() {
  try {
    const settings = await prisma.reviewSettings.findFirst();
    
    if (!settings) {
      // Return defaults from schema
      return {
        success: true,
        data: {
          reviewsEnabled: true,
          requireOrderSucceeded: true,
          oneReviewPerOrder: true,
          reviewWindowDays: 30,
          moderationRequired: true,
          tokenExpiryHours: 720,
          allowTokenRegenerate: true,
          waTemplate: "Halo {customerName}! Terima kasih atas pesanan {orderCode}. Kami ingin mendengar pengalaman Anda. Klik link ini untuk memberi review: {reviewLink}",
          popupEnabled: true,
          popupMinSessions: 2,
          popupMinDaysSinceFirstSeen: 3,
          popupMinSecondsOnSite: 45,
          popupCooldownDays: 14,
          popupMaxImpressionsPerWindow: 3,
          popupOnlyIfEligibleOrdersExist: true,
          popupTitle: "Bagaimana pengalaman Anda?",
          popupBody: "Kami ingin mendengar pendapat Anda tentang toko kami!",
          successMessage: "Terima kasih atas review Anda!",
          myOrdersReviewEnabled: true,
          showReviewForLastNOrders: 5,
          allowResubmitOnRejected: false,
          ratingRequired: true,
          minMessageLength: 10,
          maxMessageLength: 300,
        },
      };
    }

    return { success: true, data: settings };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to fetch review settings";
    return { success: false, error: errorMessage };
  }
}
