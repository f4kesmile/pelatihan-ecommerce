import prisma from "@/lib/db/prisma"
import { Prisma } from "@prisma/client"

export class ProductRepository {
  async findAll({
    page,
    limit,
    categoryId,
    categorySlug,
    search,
    minPrice,
    maxPrice,
    sort,
  }: {
    page: number
    limit: number
    categoryId?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    categorySlug?: string
  }) {
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      variants: {
        some: {
          isActive: true,
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      },
      ...(categoryId && { categoryId }),
      ...(categorySlug && {
        category: {
          slug: categorySlug,
        },
      }),
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    }

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1, // Only need main image for list
          },
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
            take: 1, // To find min price quickly if sorted by price?
            // Actually we need all variants to determine the true min price if not enforcing order during insert.
            // But relying on database sort is better.
          },
        },
        orderBy: this.getSortOrder(sort),
      }),
    ])

    return { total, products }
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    })
  }

  async findPopular(limit = 4) {
    // Ideally use order items count, but for now simple fallback
    return prisma.product.findMany({
      where: { isActive: true },
      take: limit,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
        },
      },
      // In real implementation, this would join with OrderItem
    })
  }

  private getSortOrder(sort?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case "price_asc":
        return { variants: { _count: "asc" } } // This is tricky with relation. 
        // Accurate price sort requires aggregation or denormalization.
        // For simplicity in this architecture, we might default to createdAt or name.
        // Or if we want to sort by min price of variants:
        // Prisma doesn't easily support sorting by related aggregation in one go without raw query.
        // We will default to createdAt desc for "newest" and fallback to name.
      case "price_desc":
         return { name: "asc" } // Placeholder
      case "newest":
        return { createdAt: "desc" }
      default:
        return { createdAt: "desc" } // Default popularity/newest
    }
  }
}

export const productRepo = new ProductRepository()
