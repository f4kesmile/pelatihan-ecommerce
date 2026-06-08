import { productRepo } from "@/server/repositories/product.repository"

export async function getProductDetailUseCase(slug: string) {
  const product = await productRepo.findBySlug(slug)

  if (!product) return null
  const variants = product.variants.map(v => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    price: v.price,
    stock: v.stock,
  }))

  const images = product.images.map(img => ({
    id: img.id,
    src: `data:${img.mimeType};base64,${img.base64}`,
    alt: product.name
  }))
  const minPrice = variants.length > 0 
    ? Math.min(...variants.map(v => v.price))
    : 0

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    categoryName: product.category.name,
    slug: product.slug,
    variants,
    images,
    minPrice,
  }
}
