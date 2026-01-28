"use server";

import prisma from "@/lib/db/prisma";

export async function getDashboardStats() {
  try {
    const [
      productCount,
      orderCount,
      totalRevenue,
      pendingTestimonials,
      recentOrders
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { subtotal: true },
        where: { status: "SUCCEEDED" },
      }),
      prisma.testimonial.count({ where: { isApproved: false } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { fullName: true, email: true, avatarBase64: true },
          },
        },
      }),
    ]);

    // Mock monthly data for chart (since we don't have enough real data history yet)
    // In production, you'd aggregate this via SQL
    const monthlyRevenue = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    return {
      productCount,
      orderCount,
      totalRevenue: totalRevenue._sum.subtotal || 0,
      pendingTestimonials,
      recentOrders,
      monthlyRevenue, 
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      productCount: 0,
      orderCount: 0,
      totalRevenue: 0,
      pendingTestimonials: 0,
      recentOrders: [],
      monthlyRevenue: [],
    };
  }
}
