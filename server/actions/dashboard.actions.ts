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
      prisma.testimonial.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, avatarBase64: true },
          },
        },
      }),
    ]);

    // Aggregate monthly revenue for the current year
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const monthlyOrders = await prisma.order.findMany({
      where: {
        status: "SUCCEEDED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        subtotal: true,
      },
    });

    const monthlyRevenueMap = new Array(12).fill(0);
    monthlyOrders.forEach((order) => {
      const month = order.createdAt.getMonth(); // 0-11
      monthlyRevenueMap[month] += order.subtotal;
    });

    const monthlyRevenue = [
      { name: "Jan", total: monthlyRevenueMap[0] },
      { name: "Feb", total: monthlyRevenueMap[1] },
      { name: "Mar", total: monthlyRevenueMap[2] },
      { name: "Apr", total: monthlyRevenueMap[3] },
      { name: "May", total: monthlyRevenueMap[4] },
      { name: "Jun", total: monthlyRevenueMap[5] },
      { name: "Jul", total: monthlyRevenueMap[6] },
      { name: "Aug", total: monthlyRevenueMap[7] },
      { name: "Sep", total: monthlyRevenueMap[8] },
      { name: "Oct", total: monthlyRevenueMap[9] },
      { name: "Nov", total: monthlyRevenueMap[10] },
      { name: "Dec", total: monthlyRevenueMap[11] },
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
