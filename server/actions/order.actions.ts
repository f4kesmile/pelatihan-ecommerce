"use server"

import prisma from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"
import { updateOrderStatusSchema, UpdateOrderStatusInput } from "@/server/schemas/order.schema"
import { createClient } from "@/lib/supabase/server"

export async function getUserOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { orders: [], error: "Not authenticated" }
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true, images: true } },
          variant: { select: { name: true } },
        },
      },
      testimonial: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return { orders }
}

export async function getOrders(filters?: {
  status?: OrderStatus
  page?: number
  limit?: number
}) {
  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const skip = (page - 1) * limit

  const where = filters?.status ? { status: filters.status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        items: true,
        testimonial: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { fullName: true, email: true, phone: true },
      },
      items: {
        include: {
          product: { select: { name: true, slug: true } },
          variant: { select: { name: true } },
        },
      },
      statusLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return order
}

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  const validation = updateOrderStatusSchema.safeParse(input)

  if (!validation.success) {
    return { error: "Invalid input data" }
  }

  const { orderId, status, note } = validation.data

  try {
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    })

    if (!currentOrder) {
      return { error: "Order not found" }
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status },
      }),
      prisma.orderStatusLog.create({
        data: {
          orderId,
          from: currentOrder.status,
          to: status,
          changedBy: "admin",
          note: note || null,
        },
      }),
    ])

    revalidatePath("/dashboard/orders")
    revalidatePath(`/dashboard/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update order status:", error)
    return { error: "Failed to update order status" }
  }
}

interface CreateOrderParams {
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: {
    productId: string;
    variantId: string;
    productName: string;
    variantName: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  subtotal: number;
}

export async function createOrder(data: CreateOrderParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to place an order" };
  }

  // Get User Profile ID
  const userProfile = await prisma.userProfile.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!userProfile) {
    return { error: "User profile not found. Please complete your profile." };
  }

  try {
    // Generate Order Number: ORD-YYYYMMDD-XXXX (4 random digits)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${random}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: userProfile.id,
        status: "PENDING",
        buyerName: data.customer.name,
        buyerPhone: data.customer.phone,
        buyerAddress: data.customer.address,
        buyerNote: data.customer.notes,
        subtotal: data.subtotal,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            unitPrice: item.price,
            quantity: item.quantity,
            lineTotal: item.price * item.quantity,
          })),
        },
        statusLogs: {
          create: {
            from: "PENDING",
            to: "PENDING",
            changedBy: "system",
            note: "Order created",
          },
        },
      },
    });

    revalidatePath("/dashboard/orders");
    return { success: true, orderId: newOrder.id, orderNumber: newOrder.orderNumber };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { error: "Failed to create order. Please try again." };
  }
}
