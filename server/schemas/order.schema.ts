import { z } from "zod"
import { OrderStatus } from "@prisma/client"

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.nativeEnum(OrderStatus),
  note: z.string().optional(),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

export const orderFiltersSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
})

export type OrderFilters = z.infer<typeof orderFiltersSchema>
