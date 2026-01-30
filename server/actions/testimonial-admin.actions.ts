"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function getAllTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function updateTestimonialStatus(id: string, status: "APPROVED" | "PENDING" | "REJECTED" | "HIDDEN") {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard/testimonials");
    revalidatePath("/"); // Update homepage
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    return { success: false, error: "Failed to update status" };
  }
}


  
export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    revalidatePath("/dashboard/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Failed to delete testimonial" };
  }
}
