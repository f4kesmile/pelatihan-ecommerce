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

export async function getEligibleOrdersForReview(userId: string) {
  try {
    const settingsResult = await getReviewSettingsWithDefaults();
    if (!settingsResult.success || !settingsResult.data) {
      throw new Error("Failed to load settings");
    }
    const settings = settingsResult.data;

    const reviewWindowCutoff = new Date();
    reviewWindowCutoff.setDate(
      reviewWindowCutoff.getDate() - settings.reviewWindowDays
    );

    const orders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: reviewWindowCutoff,
        },
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
        testimonial: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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

export async function submitReviewFromMyOrders(
  data: Omit<TestimonialSubmission, "source">
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const validatedData = testimonialSubmissionSchema.parse({
      ...data,
      source: "MY_ORDERS",
    });

    const settingsResult = await getReviewSettingsWithDefaults();
    if (!settingsResult.success || !settingsResult.data) {
      return { success: false, error: "Failed to load review settings." };
    }
    const settings = settingsResult.data;

    if (!settings.reviewsEnabled || !settings.myOrdersReviewEnabled) {
      return { success: false, error: "Reviews are currently disabled." };
    }

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

    if (settings.requireOrderSucceeded && order.status !== "SUCCEEDED") {
      return {
        success: false,
        error: "Only succeeded orders can be reviewed.",
      };
    }

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

    if (order.testimonial) {
      if (
        order.testimonial.status === "REJECTED" &&
        settings.allowResubmitOnRejected
      ) {
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

    if (
      validatedData.message.length < settings.minMessageLength ||
      validatedData.message.length > settings.maxMessageLength
    ) {
      return {
        success: false,
        error: `Message must be between ${settings.minMessageLength} and ${settings.maxMessageLength} characters.`,
      };
    }

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

export async function generateTestimonialToken(orderId: string) {
  try {
    const settingsResult = await getReviewSettingsWithDefaults();
    
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

export async function validateMagicLinkToken(token: string) {
  try {
    const verification = verifyToken(token);
    if (!verification.valid || !verification.orderId) {
      return { success: false, error: verification.error || "Invalid link" };
    }

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

export async function submitReviewViaMagicLink(
  token: string,
  data: Omit<TestimonialSubmission, "source" | "orderId">
) {
  try {
    const verification = verifyToken(token);
    if (!verification.valid || !verification.orderId) {
      return { success: false, error: verification.error || "Invalid token" };
    }

    const orderId = verification.orderId;

    const validatedData = testimonialSubmissionSchema.parse({
      ...data,
      orderId,
      source: "MAGIC_LINK",
    });

    const settingsResult = await getReviewSettingsWithDefaults();
    if (!settingsResult.success || !settingsResult.data) {
      return { success: false, error: "System error loading settings" };
    }
    const settings = settingsResult.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { testimonial: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

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

    if (
      validatedData.message.length < settings.minMessageLength ||
      validatedData.message.length > settings.maxMessageLength
    ) {
      return {
        success: false,
        error: `Message must be between ${settings.minMessageLength} and ${settings.maxMessageLength} characters.`,
      };
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        rating: validatedData.rating,
        message: validatedData.message,
        source: "MAGIC_LINK",
        status: settings.moderationRequired ? "PENDING" : "APPROVED",
        submittedAt: new Date(),
        ...(settings.moderationRequired ? {} : { approvedAt: new Date() }),
      },
    });

    revalidatePath("/orders");

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

export async function getLatestEligibleOrder(userId: string) {
  try {
    const { orders, settings } = await getEligibleOrdersForReview(userId);

    if (!settings || !settings.reviewsEnabled) {
      return null;
    }

    const eligibleOrder = orders.find((order) => {
      if (order.testimonial) {
        if (
          order.testimonial.status === "REJECTED" &&
          settings.allowResubmitOnRejected
        ) {
          return true;
        }
        return false;
      }
      return true;
    });

    if (!eligibleOrder) return null;

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

export async function updateTestimonialStatus(id: string, status: string) {
  try {
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
    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Failed to update status" };
  }
}

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
