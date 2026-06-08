"use server"

import prisma from "@/lib/db/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { storeConfigSchema, StoreConfigFormValues } from "@/server/schemas/store.schema"

export async function getStoreConfig() {
  const config = await prisma.storeConfig.findFirst({
    orderBy: { createdAt: "desc" },
  })

  if (!config) {
     return null
  }
  return config as unknown as (typeof config & { heroProductConfigs: StoreConfigFormValues["heroProductConfigs"] })
}

export async function updateStoreConfig(data: StoreConfigFormValues) {
  const validation = storeConfigSchema.safeParse(data)

  if (!validation.success) {
    console.error("Validation error:", validation.error.format());
    return { error: "Invalid data" }
  }

  // Ensure heroProductConfigs is treated as JSON
  const dataToSave = {
    ...validation.data,
    heroProductConfigs: validation.data.heroProductConfigs as Prisma.InputJsonValue
  }

  try {
    const existing = await prisma.storeConfig.findFirst()

    if (existing) {
      await prisma.storeConfig.update({
        where: { id: existing.id },
        data: dataToSave,
      })
    } else {
      await prisma.storeConfig.create({
        data: dataToSave,
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
