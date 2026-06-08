"use server"

import prisma from "@/lib/db/prisma"
import { productFormSchema, ProductFormValues } from "@/server/schemas/product.schema"
import { revalidatePath } from "next/cache"


export async function createProduct(data: ProductFormValues) {
  const validation = productFormSchema.safeParse(data)
  
  if (!validation.success) {
    return { error: "Invalid data" }
  }

  const { name, slug, description, categoryId, isActive, isPopular, images, variants } = validation.data

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: slug!,
          description: description || "",
          categoryId,
          isActive,
          isPopular,
        },
      })

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img, index) => ({
            productId: product.id,
            base64: img.base64,
            mimeType: img.mimeType,
            size: img.size,
            name: img.name,
            sortOrder: index,
          })),
        })
      }

      await tx.productVariant.createMany({
        data: variants.map((variant) => ({
          productId: product.id,
          name: variant.name,
          sku: variant.sku ?? null,
          price: variant.price,
          stock: variant.stock,
          isActive: variant.isActive,
        })),
      })
    })

    revalidatePath("/dashboard/products")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { error: "Failed to create product" }
  }
}

export async function updateProduct(productId: string, data: ProductFormValues) {
  const validation = productFormSchema.safeParse(data)
  
  if (!validation.success) {
    return { error: "Invalid data" }
  }

  const { name, slug, description, categoryId, isActive, isPopular, images, variants } = validation.data

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name,
          slug: slug!,
          description: description || "",
          categoryId,
          isActive,
          isPopular,
        },
      })

      if (images) {
        await tx.productImage.deleteMany({ where: { productId } })
        if (images.length > 0) {
            await tx.productImage.createMany({
            data: images.map((img, index) => ({
                productId,
                base64: img.base64,
                mimeType: img.mimeType,
                size: img.size,
                name: img.name,
                sortOrder: index,
            })),
            })
        }
      }
      
      const currentVariants = await tx.productVariant.findMany({ where: { productId } })
      const currentVariantIds = currentVariants.map(v => v.id)
      const incomingVariantIds = variants.map(v => v.id).filter(Boolean) as string[]

      const toDelete = currentVariantIds.filter(id => !incomingVariantIds.includes(id))
      if (toDelete.length > 0) {
        await tx.productVariant.deleteMany({ where: { id: { in: toDelete } } })
      }

      for (const variant of variants) {
        if (variant.id && currentVariantIds.includes(variant.id)) {
            await tx.productVariant.update({
                where: { id: variant.id },
                data: {
                    name: variant.name,
                    sku: variant.sku ?? null,
                    price: variant.price,
                    stock: variant.stock,
                    isActive: variant.isActive,
                }
            })
        } else {
            await tx.productVariant.create({
                data: {
                    productId,
                    name: variant.name,
                    sku: variant.sku ?? null,
                    price: variant.price,
                    stock: variant.stock,
                    isActive: variant.isActive,
                }
            })
        }
      }
    })

    revalidatePath("/dashboard/products")
    revalidatePath(`/products/${slug}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update product:", error)
    return { error: "Failed to update product" }
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    })
    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
     console.error("Failed to delete product:", error)
     return { error: "Failed to delete product" }
  }
}
