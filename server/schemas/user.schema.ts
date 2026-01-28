import { z } from "zod"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export const userProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  avatarBase64: z.string().optional(),
  avatarMime: z.string().optional(),
  avatarSize: z.number().int().optional(),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>

export const validateAvatar = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 2MB" }
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" }
  }

  return { valid: true }
}
