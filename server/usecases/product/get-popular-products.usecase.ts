import { productRepo } from "@/server/repositories/product.repository"

export async function getPopularProductsUseCase(limit = 4) {
  try {
    const products = await productRepo.findPopular(limit)

    return products.map((p) => {
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
      }
    })
  } catch (error) {
    console.error("Failed to fetch popular products:", error)
    return []
  }
}
