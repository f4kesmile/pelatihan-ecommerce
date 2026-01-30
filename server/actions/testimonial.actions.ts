"use server";

import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateToken, verifyToken } from "@/lib/utils/token";
import {
  testimonialSubmissionSchema,
  type TestimonialSubmission,
} from "../schemas/testimonial.schema";
import { getReviewSettingsWithDefaults } from "./review-settings.actions";

export async function getApprovedTestimonials(limit: number = 6) {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      status: "APPROVED",
    },
    include: {
      user: {
        select: {
          fullName: true,
          avatarBase64: true,
        },
      },
      order: {
        select: {
          items: {
            take: 1,
            select: {
              product: {
                select: {
                  name: true,
                  images: {
                    take: 1,
                    select: {
                      base64: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return testimonials;
}

/**
 * Get eligible orders for review
 * Returns orders that can have testimonials submitted
 */
export async function getEligibleOrdersForReview(userId: string) {
  try {
    const settingsResult = await getReviewSettingsWithDefaults();
    if (!settingsResult.success || !settingsResult.data) {
      throw new Error("Failed to load settings");
    }
    const settings = settingsResult.data;

    // Calculate the review window cutoff date
    const reviewWindowCutoff = new Date();
    reviewWindowCutoff.setDate(
      reviewWindowCutoff.getDate() - settings.reviewWindowDays
    );

    const orders = await prisma.order.findMany({
      where: {
        userId,
        // Only include orders within the review window
        createdAt: {
          gte: reviewWindowCutoff,
        },
        // Optionally filter by status
        ...(settings.requireOrderSucceeded && {
          status: "SUCCEEDED",
        }),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
            variant: true,
          },
        },
        testimonial: true, // Include existing testimonials
      },
      orderBy: {
        createdAt: "desc",
      },
      // Limit to last N orders if configured
      take: settings.myOrdersReviewEnabled
        ? settings.showReviewForLastNOrders
        : undefined,
    });

    return { orders, settings };
  } catch (error) {
    console.error("Error fetching eligible orders:", error);
    return { orders: [], settings: null };
  }
}

/**
 * Get existing testimonial for a specific order
 */
export async function getTestimonialByOrderId(orderId: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: {
        orderId,
      },
    });

    return { testimonial };
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return { testimonial: null };
  }
}

/**
 * Submit review from My Orders
 */
export async function submitReviewFromMyOrders(
  data: Omit<TestimonialSubmission, "source">
) {
  try {
    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Validate input
    const validatedData = testimonialSubmissionSchema.parse({
      ...data,
      source: "MY_ORDERS",
    });

    // Get review settings
    const settingsResult = await getReviewSettingsWithDefaults();
    if (!settingsResult.success || !settingsResult.data) {
      return { success: false, error: "Failed to load review settings." };
    }
    const settings = settingsResult.data;

    // Check if reviews are enabled
    if (!settings.reviewsEnabled || !settings.myOrdersReviewEnabled) {
      return { success: false, error: "Reviews are currently disabled." };
    }

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: {
        id: validatedData.orderId,
      },
      include: {
        testimonial: true,
      },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    if (order.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized. Order does not belong to you.",
      };
    }

    // Check order status
    if (settings.requireOrderSucceeded && order.status !== "SUCCEEDED") {
      return {
        success: false,
        error: "Only succeeded orders can be reviewed.",
      };
    }

    // Check review window
    const reviewWindowCutoff = new Date();
    reviewWindowCutoff.setDate(
      reviewWindowCutoff.getDate() - settings.reviewWindowDays
    );

    if (order.createdAt < reviewWindowCutoff) {
      return {
        success: false,
        error: "Review window has expired for this order.",
      };
    }

    // Check for existing testimonial
    if (order.testimonial) {
      // Allow resubmit if rejected and setting allows
      if (
        order.testimonial.status === "REJECTED" &&
        settings.allowResubmitOnRejected
      ) {
        // Delete old rejected testimonial
        await prisma.testimonial.delete({
          where: {
            id: order.testimonial.id,
          },
        });
      } else {
        return {
          success: false,
          error: "You have already submitted a review for this order.",
        };
      }
    }

    // Validate message length
    if (
      validatedData.message.length < settings.minMessageLength ||
      validatedData.message.length > settings.maxMessageLength
    ) {
      return {
        success: false,
        error: `Message must be between ${settings.minMessageLength} and ${settings.maxMessageLength} characters.`,
      };
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        orderId: validatedData.orderId,
        userId: user.id,
        rating: validatedData.rating,
        message: validatedData.message,
        source: validatedData.source,
        status: settings.moderationRequired ? "PENDING" : "APPROVED",
        submittedAt: new Date(),
        ...(settings.moderationRequired ? {} : { approvedAt: new Date() }),
      },
    });

    // Revalidate paths
    revalidatePath("/orders");
    revalidatePath("/(dashboard)/dashboard/reviews");

    return {
      success: true,
      testimonial,
      message: settings.moderationRequired
        ? "Review submitted successfully! It will appear after moderation."
        : "Review submitted successfully!",
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      error: "Failed to submit review. Please try again.",
    };
  }
}


/**
 * Generate a magic link token for an order
 */
export async function generateTestimonialToken(orderId: string) {
  try {
    // Get settings to determine expiry
    const settingsResult = await getReviewSettingsWithDefaults();
    
    // Default to 30 days if settings fail to load or are missing
    const reviewWindowDays = settingsResult.success && settingsResult.data
      ? settingsResult.data.reviewWindowDays
      : 30;

    const expiryHours = reviewWindowDays * 24;
    const token = generateToken(orderId, expiryHours);
    return { success: true, token };
  } catch (error) {
    console.error("Error generating token:", error);
    return { success: false, error: "Failed to generate token" };
  }
}

/**
 * Validate a magic link token and get order details
 */
export async function validateMagicLinkToken(token: string) {
  try {
    // Verify token signature and expiry
    const verification = verifyToken(token);
    if (!verification.valid || !verification.orderId) {
      return { success: false, error: verification.error || "Invalid link" };
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: verification.orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
            variant: true,
          },
        },
        testimonial: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Check settings for global review status
    const settingsResult = await getReviewSettingsWithDefaults();
    const settings = settingsResult.success ? settingsResult.data : null;

    if (settings && !settings.reviewsEnabled) {
      return { success: false, error: "Reviews are currently disabled" };
    }

    if (
      settings &&
      settings.requireOrderSucceeded &&
      order.status !== "SUCCEEDED"
    ) {
      return {
        success: false,
        error: "This order is not eligible for review (Status: " + order.status + ")",
      };
    }

    return { success: true, order, settings };
  } catch (error) {
    console.error("Error validating token:", error);
    return { success: false, error: "System error validating link" };
  }
}

/**
 * Submit review via Magic Link (No auth required)
 */
export async function submitReviewViaMagicLink(
  token: string,
  data: Omit<TestimonialSubmission, "source" | "orderId">
) {
  try {
    // 1. Verify token
    const verification = verifyToken(token);
    if (!verification.valid || !verification.orderId) {
      return { success: false, error: verification.error || "Invalid token" };
    }

    const orderId = verification.orderId;

    // 2. Validate input
    const validatedData = testimonialSubmissionSchema.parse({
      ...data,
      orderId, // Injected from token
      source: "MAGIC_LINK",
    });

    // 3. Get Settings
    const settingsResult = await getReviewSettingsWithDefaults();
    if (!settingsResult.success || !settingsResult.data) {
      return { success: false, error: "System error loading settings" };
    }
    const settings = settingsResult.data;

    // 4. Validate Order & Logic
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { testimonial: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Check duplication / resubmission
    if (order.testimonial) {
      if (
        order.testimonial.status === "REJECTED" &&
        settings.allowResubmitOnRejected
      ) {
        await prisma.testimonial.delete({ where: { id: order.testimonial.id } });
      } else {
        return {
          success: false,
          error: "A review has already been submitted for this order.",
        };
      }
    }

    // Check message length logic
    if (
      validatedData.message.length < settings.minMessageLength ||
      validatedData.message.length > settings.maxMessageLength
    ) {
      return {
        success: false,
        error: `Message must be between ${settings.minMessageLength} and ${settings.maxMessageLength} characters.`,
      };
    }

    // 5. Create Testimonial (Attributed to order.userId)
    const testimonial = await prisma.testimonial.create({
      data: {
        orderId: order.id,
        userId: order.userId, // Authenticated via the signed token = user ownership proved
        rating: validatedData.rating,
        message: validatedData.message,
        source: "MAGIC_LINK",
        status: settings.moderationRequired ? "PENDING" : "APPROVED",
        submittedAt: new Date(),
        ...(settings.moderationRequired ? {} : { approvedAt: new Date() }),
      },
    });

    revalidatePath("/orders"); // In case they visit their dashboard later

    return {
      success: true,
      testimonial,
      message: settings.moderationRequired
        ? "Review submitted! It will appear after moderation."
        : "Review submitted successfully!",
    };
  } catch (error) {
    console.error("Error submitting magic link review:", error);
    return { success: false, error: "Submission failed" };
  }
}

/**
 * Get the latest eligible order for the smart popup
 * Prioritizes:
 * 1. Most recent delivered/succeeded order
 * 2. Within review window
 * 3. Not yet reviewed (or eligible for resubmit)
 */
export async function getLatestEligibleOrder(userId: string) {
  try {
    const { orders, settings } = await getEligibleOrdersForReview(userId);

    if (!settings || !settings.reviewsEnabled) {
      return null;
    }

    // Filter for popup eligibility
    const eligibleOrder = orders.find((order) => {
      // 1. Check if already reviewed
      if (order.testimonial) {
        if (
          order.testimonial.status === "REJECTED" &&
          settings.allowResubmitOnRejected
        ) {
          return true; // Eligible for resubmit
        }
        return false; // Already reviewed
      }
      return true; // Not reviewed
    });

    if (!eligibleOrder) return null;

    // Return minimal data needed for popup
    return {
      orderId: eligibleOrder.id,
      orderNumber: eligibleOrder.orderNumber,
      productName: eligibleOrder.items[0]?.product.name || "Order",
      productImage: eligibleOrder.items[0]?.product.images[0]?.base64 || null,
      createdAt: eligibleOrder.createdAt,
    };
  } catch (error) {
    console.error("Error getting latest eligible order:", error);
    return null;
  }
}

/**
 * Admin: Get all testimonials with filtering and pagination
 */
export async function getTestimonials({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // In a real app, check for ADMIN role here
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const skip = (page - 1) * limit;

    const where: Prisma.TestimonialWhereInput = {};
    if (status && status !== "ALL") {
      where.status = status as "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
    }
    if (search) {
      where.OR = [
        { message: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { order: { orderNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              avatarBase64: true,
            },
          },
          order: {
            select: {
              orderNumber: true,
              createdAt: true,
              items: {
                take: 1,
                select: {
                  id: true,
                  productName: true,
                  variantName: true,
                  quantity: true,
                  unitPrice: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return {
      success: true,
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error: "Failed to fetch testimonials" };
  }
}

/**
 * Admin: Update testimonial status
 */
export async function updateTestimonialStatus(id: string, status: string) {
  try {
    // Validate status enum (basic check)
    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "HIDDEN"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const data: Prisma.TestimonialUpdateInput = {
      status: status as "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN",
    };
    if (status === "APPROVED") {
      data.approvedAt = new Date();
    } else if (status === "REJECTED") {
      data.rejectedAt = new Date();
    }

    await prisma.testimonial.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/reviews");
    revalidatePath("/orders"); // To update user's view
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Admin: Delete testimonial
 */
export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });

    revalidatePath("/dashboard/reviews");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Failed to delete testimonial" };
  }
}
