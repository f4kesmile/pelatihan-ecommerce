"use server"

import prisma from "@/lib/db/prisma"

export async function getApprovedTestimonials(limit: number = 6) {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      isApproved: true,
      isHidden: false,
    },
    include: {
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return testimonials
}
