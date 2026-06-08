"use server";

import prisma from "@/lib/db/prisma";

export async function searchProducts(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        images: {
          take: 5,
          select: {
            base64: true,
            mimeType: true,
          },
        },
        variants: {
          take: 1,
          select: {
            price: true,
          },
        },
      },
      take: 10,
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: "Failed to search products" };
  }
}

export async function getProductsByIds(ids: string[]) {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        images: {
          take: 5,
          select: {
            base64: true,
            mimeType: true,
          },
        },
        variants: {
          take: 1,
          select: {
            price: true,
          },
        },
        slug: true,
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching selected products:", error);
    return { success: false, error: "Failed to fetch selected products" };
  }
}
