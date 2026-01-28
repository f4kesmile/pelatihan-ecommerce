import { z } from "zod"

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  notes: z.string().optional(),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
