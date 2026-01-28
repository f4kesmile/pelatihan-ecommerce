import { z } from "zod"

const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
  isActive: z.boolean().default(true),
})

const productImageSchema = z.object({
  id: z.string().optional(),
  base64: z.string().min(1, "Image data is required"),
  mimeType: z.string().min(1, "Mime type is required"),
  size: z.number().min(0),
  name: z.string().min(1, "Image name is required"),
})

export const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  
  images: z.array(productImageSchema).optional(),
  
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
