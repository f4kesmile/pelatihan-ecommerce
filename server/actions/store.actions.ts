"use server"

import prisma from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"
import { storeConfigSchema, StoreConfigFormValues } from "@/server/schemas/store.schema"

export async function getStoreConfig() {
  const config = await prisma.storeConfig.findFirst({
    orderBy: { createdAt: "desc" }, // Get the latest one
  })

  // Fallback if no config exists (should be seeded, but safe fallback logic)
  if (!config) {
     return null
  }
  return config
}

export async function updateStoreConfig(data: StoreConfigFormValues) {
  const validation = storeConfigSchema.safeParse(data)

  if (!validation.success) {
    return { error: "Invalid data" }
  }

  try {
    // Upsert logic: Update the first one found, or create new if absolutely empty
    // Since we rely on 'findFirst' for reading, we should try to update the existing one.
    const existing = await prisma.storeConfig.findFirst()

    if (existing) {
      await prisma.storeConfig.update({
        where: { id: existing.id },
        data: validation.data,
      })
    } else {
      await prisma.storeConfig.create({
        data: validation.data,
      })
    }

    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to update store config:", error)
    return { error: "Failed to update configuration" }
  }
}
