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
            take: 1, 
          },
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
            take: 1, 
          },
          _count: {
            select: { orderItems: true },
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
    return prisma.product.findMany({
      where: { 
        isActive: true,
        OR: [
            { isPopular: true }, 
            { orderItems: { some: {} } } 
        ]
      },
      orderBy: [
        { isPopular: 'desc' }, 
        { orderItems: { _count: 'desc' } }, 
        { createdAt: 'desc' } 
      ],
      take: limit,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
        },
        _count: {
          select: { orderItems: true },
        },
      },
    })
  }

  private getSortOrder(sort?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case "price_asc":
        return { variants: { _count: "asc" } } 
      case "price_desc":
         return { name: "asc" } 
      case "newest":
        return { createdAt: "desc" }
      default:
        return { createdAt: "desc" }
    }
  }
}

export const productRepo = new ProductRepository()
