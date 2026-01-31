"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createCategory(name: string) {
  if (!name || name.trim().length === 0) {
    return { error: "Category name is required" };
  }

  const trimmedName = name.trim();
  
  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const existing = await prisma.category.findFirst({
    where: { 
      OR: [
        { name: { equals: trimmedName, mode: "insensitive" } },
        { slug: slug }
      ]
    },
  });

  if (existing) {
    return { error: "Category already exists" };
  }

  try {
    const category = await prisma.category.create({
      data: { 
        name: trimmedName,
        slug: slug,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: "Failed to create category" };
  }
}

export async function deleteCategory(id: string) {
  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productsCount > 0) {
    return { error: `Cannot delete category with ${productsCount} products` };
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { error: "Failed to delete category" };
  }
}
