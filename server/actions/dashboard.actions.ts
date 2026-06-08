"use server";

import prisma from "@/lib/db/prisma";

export type TimeRange = "day" | "week" | "month" | "year";

export async function getDashboardStats() {
  try {
    const [productCount, orderCount, totalRevenue, pendingTestimonials] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { subtotal: true },
          where: { status: "SUCCEEDED" },
        }),
        prisma.testimonial.count({ where: { status: "PENDING" } }),
      ]);

    return {
      productCount,
      orderCount,
      totalRevenue: totalRevenue._sum.subtotal || 0,
      pendingTestimonials,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      productCount: 0,
      orderCount: 0,
      totalRevenue: 0,
      pendingTestimonials: 0,
    };
  }
}

export async function getChartData(range: TimeRange) {
  try {
    const now = new Date();

    switch (range) {
      case "day": {
        const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
        const currentDay = now.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const orders = await prisma.order.findMany({
          where: {
            status: "SUCCEEDED",
            createdAt: { gte: monday, lte: sunday },
          },
          select: { createdAt: true, subtotal: true },
        });

        const dailyMap = new Array(7).fill(0);
        orders.forEach((order) => {
          const d = new Date(order.createdAt).getDay();
          const idx = d === 0 ? 6 : d - 1;
          dailyMap[idx] += order.subtotal;
        });

        return dayNames.map((name, i) => ({ name, total: dailyMap[i] }));
      }

      case "week": {
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const orders = await prisma.order.findMany({
          where: {
            status: "SUCCEEDED",
            createdAt: { gte: firstDay, lte: lastDay },
          },
          select: { createdAt: true, subtotal: true },
        });

        const totalDays = lastDay.getDate();
        const weekCount = Math.ceil(totalDays / 7);
        const weeklyMap = new Array(weekCount).fill(0);

        orders.forEach((order) => {
          const day = new Date(order.createdAt).getDate();
          const weekIdx = Math.min(Math.floor((day - 1) / 7), weekCount - 1);
          weeklyMap[weekIdx] += order.subtotal;
        });

        return weeklyMap.map((total, i) => ({
          name: `Week ${i + 1}`,
          total,
        }));
      }

      case "month": {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const orders = await prisma.order.findMany({
          where: {
            status: "SUCCEEDED",
            createdAt: { gte: startOfYear, lte: endOfYear },
          },
          select: { createdAt: true, subtotal: true },
        });

        const monthlyMap = new Array(12).fill(0);
        orders.forEach((order) => {
          const m = new Date(order.createdAt).getMonth();
          monthlyMap[m] += order.subtotal;
        });

        return monthNames.map((name, i) => ({ name, total: monthlyMap[i] }));
      }

      case "year": {
        const orders = await prisma.order.findMany({
          where: { status: "SUCCEEDED" },
          select: { createdAt: true, subtotal: true },
        });

        const yearlyMap: Record<number, number> = {};
        orders.forEach((order) => {
          const y = new Date(order.createdAt).getFullYear();
          yearlyMap[y] = (yearlyMap[y] || 0) + order.subtotal;
        });

        const years = Object.keys(yearlyMap)
          .map(Number)
          .sort((a, b) => a - b);

        if (years.length === 0) {
          return [{ name: String(now.getFullYear()), total: 0 }];
        }

        return years.map((y) => ({ name: String(y), total: yearlyMap[y] }));
      }
    }
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}

function getTimeRangeFilter(range: TimeRange): { gte: Date; lte: Date } {
  const now = new Date();

  switch (range) {
    case "day": {
      const currentDay = now.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return { gte: monday, lte: sunday };
    }
    case "week": {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      return { gte: firstDay, lte: lastDay };
    }
    case "month": {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { gte: startOfYear, lte: endOfYear };
    }
    case "year": {
      const veryOld = new Date(2000, 0, 1);
      const future = new Date(2100, 0, 1);
      return { gte: veryOld, lte: future };
    }
  }
}

export async function getRecentSales(range: TimeRange) {
  try {
    const filter = getTimeRangeFilter(range);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: filter.gte, lte: filter.lte },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarBase64: true,
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return [];
  }
}

export async function getAdminNotifications() {
  try {
    const [pendingOrders, lowStockVariants] = await Promise.all([
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.productVariant.count({
        where: {
          stock: { lte: 5 },
          isActive: true,
        },
      }),
    ]);

    return {
      pendingOrders,
      lowStockVariants,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      pendingOrders: 0,
      lowStockVariants: 0,
    };
  }
}
