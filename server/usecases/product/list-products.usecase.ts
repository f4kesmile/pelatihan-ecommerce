import { productRepo } from "@/server/repositories/product.repository"

interface ListProductsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}

export async function listProductsUseCase(params: ListProductsParams) {
  const page = params.page || 1
  const limit = params.limit || 12

  const { total, products } = await productRepo.findAll({
    ...params,
    page,
    limit,
  })

  // Transform to DTO if needed using minVariantPrice logic
  const mappedProducts = products.map((p) => {
    // Calculate min price from the fetched variants
    // Repo fetched 'variants' (maybe filtered/limited). 
    // To be safe, we rely on what repo returned.
    const minPrice = p.variants?.[0]?.price || 0

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryName: p.category.name,
      image: p.images[0]?.base64 
        ? `data:${p.images[0].mimeType};base64,${p.images[0].base64}` 
        : null,
      minPrice,
      hasStock: p.variants.some(v => v.stock > 0),
      isPopular: p.isPopular || (p._count?.orderItems ?? 0) > 0,
    }
  })

  return {
    data: mappedProducts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
