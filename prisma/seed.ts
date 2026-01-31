import prisma from "../lib/db/prisma"

async function main() {
  console.log("🌱 Starting database seed...")
  console.log("Creating store config...")
  await prisma.storeConfig.deleteMany({})
  
  await prisma.storeConfig.create({
    data: {
      storeName: "Zinc Store",
      storeCity: "Jakarta",
      heroHeadline: "Premium E-Commerce Experience",
      heroSubheadline: "Discover our curated collection of high-quality products. Designed for excellence, built for you.",
      heroCtaText: "Shop Now",
      heroCtaHref: "/products",
      companyName: "Zinc Store Indonesia",
      companyAbout: "Premium products curated for you. Quality guaranteed since 2024.",
      companyAddress: "Jakarta, Indonesia",
      supportEmail: "support@zincstore.com",
      whatsappSupport: "628123456789",
      whatsappAdmin: "628987654321",
      whatsappTemplate: "Halo Zinc Store! Saya {customerName} ingin memesan:",
      termsTitle: "Terms & Conditions",
      termsContent: "By using our service, you agree to our terms and conditions.",
    },
  })
  console.log("Creating categories...")
  await prisma.category.deleteMany({})
  
  const clothing = await prisma.category.create({
    data: { name: "Clothing", slug: "clothing", isActive: true },
  })
  
  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics", isActive: true },
  })
  
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories", isActive: true },
  })
  console.log("Creating sample products...")
  
  const product1 = await prisma.product.create({
    data: {
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-tshirt",
      description: "High-quality 100% cotton t-shirt with modern fit. Breathable and comfortable for all-day wear.",
      categoryId: clothing.id,
      isActive: true,
      variants: {
        create: [
          { name: "Black - Small", price: 199000, stock: 50 },
          { name: "Black - Medium", price: 199000, stock: 75 },
          { name: "Black - Large", price: 199000, stock: 60 },
          { name: "White - Small", price: 199000, stock: 40 },
          { name: "White - Medium", price: 199000, stock: 80 },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      description: "Premium wireless earbuds with active noise cancellation and 24-hour battery life. Crystal clear sound quality.",
      categoryId: electronics.id,
      isActive: true,
      variants: {
        create: [
          { name: "Black Edition", price: 899000, stock: 30 },
          { name: "White Edition", price: 899000, stock: 25 },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      name: "Leather Backpack",
      slug: "leather-backpack",
      description: "Genuine leather backpack with laptop compartment. Perfect for work or travel.",
      categoryId: accessories.id,
      isActive: true,
      variants: {
        create: [
          { name: "Brown Leather", price: 1299000, stock: 15 },
          { name: "Black Leather", price: 1299000, stock: 20 },
        ],
      },
    },
  })
  console.log("Creating sample user...")
  const user = await prisma.userProfile.create({
    data: {
      supabaseUserId: "placeholder-user-id",
      email: "user@example.com",
      fullName: "Guest User",
      phone: "08123456789",
      city: "Jakarta",
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      role: "USER",
    },
  })
  console.log("Creating sample orders...")
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      orderNumber: "ORD-2024-001",
      buyerName: "Guest User",
      buyerPhone: "08123456789",
      buyerAddress: "Jl. Sudirman No. 123, Jakarta Selatan",
      buyerNote: "Please pack carefully",
      subtotal: 398000,
      status: "PENDING",
      items: {
        create: [
          {
            productId: product1.id,
            variantId: (await prisma.productVariant.findFirst({ where: { productId: product1.id } }))!.id,
            productName: "Premium Cotton T-Shirt",
            variantName: "Black - Medium",
            quantity: 2,
            unitPrice: 199000,
            lineTotal: 398000,
          },
        ],
      },
    },
  })

  await prisma.orderStatusLog.create({
    data: {
      orderId: order1.id,
      from: "PENDING",
      to: "PENDING",
      changedBy: "system",
      note: "Order created",
    },
  })
  console.log("Creating sample testimonials...")
  await prisma.testimonial.create({
    data: {
      userId: user.id,
      orderId: order1.id,
      rating: 5,
      message: "Excellent product quality! The t-shirt fits perfectly and the material is very comfortable. Highly recommend!",
      status: "APPROVED",
      source: "MY_ORDERS",
      approvedAt: new Date(),
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log(`
  📊 Created:
  - 1 Store Configuration
  - 3 Products with multiple variants
  - 1 User Profile
  - 1 Sample Order
  - 1 Testimonial
  `)
  console.log("Creating review system settings...")
  await prisma.reviewSettings.deleteMany({})
  
  await prisma.reviewSettings.create({
    data: {
      reviewsEnabled: true,
      requireOrderSucceeded: true,
      oneReviewPerOrder: true,
      reviewWindowDays: 30,
      moderationRequired: true,
      tokenExpiryHours: 720, // 30 days
      allowTokenRegenerate: true,
      waTemplate: "Halo {customerName}! Terima kasih atas pesanan {orderCode}. Kami ingin mendengar pengalaman Anda. Klik link ini untuk memberi review: {reviewLink}",
      popupEnabled: true,
      popupMinSessions: 2,
      popupMinDaysSinceFirstSeen: 3,
      popupMinSecondsOnSite: 45,
      popupCooldownDays: 14,
      popupMaxImpressionsPerWindow: 3,
      popupOnlyIfEligibleOrdersExist: true,
      popupTitle: "Bagaimana pengalaman Anda?",
      popupBody: "Kami ingin mendengar pendapat Anda tentang toko kami!",
      successMessage: "Terima kasih atas review Anda!",
      myOrdersReviewEnabled: true,
      showReviewForLastNOrders: 5,
      allowResubmitOnRejected: false,
      ratingRequired: true,
      minMessageLength: 10,
      maxMessageLength: 300,
    },
  })

  console.log(`
  ✅ Database seeded successfully!
  
  Summary:
  - 1 Store Configuration
  - 3 Categories
  - 3 Products with multiple variants
  - 1 User Profile
  - 1 Sample Order
  - 1 Testimonial
  - 1 Review System Settings ⭐
  `)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
