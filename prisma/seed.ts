import prisma from "../lib/db/prisma"
import { generateProductImage } from "./seed-image-gen"
import { TERMS_CONTENT, PRIVACY_CONTENT } from "./seed-content"

async function main() {
  console.log("🌱 Starting comprehensive database seed...")

  console.log("🗑️ Cleaning existing data...")
  await prisma.testimonial.deleteMany({})
  await prisma.testimonialRequestToken.deleteMany({})
  await prisma.orderStatusLog.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.cartItem.deleteMany({})
  await prisma.cart.deleteMany({})
  await prisma.productVariant.deleteMany({})
  await prisma.productImage.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.userEngagement.deleteMany({})
  await prisma.adminPermission.deleteMany({})
  await prisma.userProfile.deleteMany({})
  await prisma.fAQ.deleteMany({})
  await prisma.reviewSettings.deleteMany({})
  await prisma.storeConfig.deleteMany({})

  console.log("📦 Creating Store Config...")
  await prisma.storeConfig.create({
    data: {
      storeName: "Zinc Store",
      storeCity: "Jakarta",
      heroHeadline: "Temukan Gaya Terbaikmu",
      heroSubheadline: "Koleksi fashion premium dengan kualitas terbaik. Mulai dari pakaian kasual hingga aksesoris eksklusif, semua tersedia untuk kamu.",
      heroCtaText: "Belanja Sekarang",
      heroCtaHref: "/products",
      companyName: "PT Zinc Store Indonesia",
      companyAbout: "Zinc Store adalah toko fashion & lifestyle premium yang berdiri sejak 2024. Kami berkomitmen menyediakan produk berkualitas tinggi dengan harga terjangkau untuk semua kalangan.",
      companyAddress: "Jl. Gatot Subroto Kav. 36-38, Kuningan, Jakarta Selatan 12950",
      supportEmail: "support@zincstore.id",
      whatsappSupport: "6281234567890",
      whatsappAdmin: "6289876543210",
      whatsappTemplate: "Halo Zinc Store! Saya {customerName} ingin konfirmasi pesanan #{orderNumber}.\n\nDetail:\n{orderDetails}\n\nTerima kasih!",
      termsTitle: "Syarat & Ketentuan",
      termsContent: TERMS_CONTENT,
      privacyTitle: "Kebijakan Privasi",
      privacyContent: PRIVACY_CONTENT,
      instagramUrl: "https://instagram.com/zincstore.id",
      showInstagram: true,
      tiktokUrl: "https://tiktok.com/@zincstore.id",
      showTiktok: true,
      shopeeUrl: "https://shopee.co.id/zincstore",
      showShopee: true,
      footerSocialText: "Follow kami untuk update terbaru",
      supportLinkText: "Bantuan",
      supportLinkHref: "/support",
      faqLinkText: "FAQ",
      faqLinkHref: "/support#faq",
      termsLinkText: "Syarat & Ketentuan",
      termsLinkHref: "/terms",
      privacyLinkText: "Kebijakan Privasi",
      privacyLinkHref: "/privacy",
    },
  })

  console.log("⚙️ Creating Review Settings...")
  await prisma.reviewSettings.create({
    data: {
      reviewsEnabled: true,
      requireOrderSucceeded: true,
      oneReviewPerOrder: true,
      reviewWindowDays: 30,
      moderationRequired: true,
      tokenExpiryHours: 720,
      allowTokenRegenerate: true,
      waTemplate: "Halo {customerName}! Terima kasih atas pesanan {orderCode}. Bagaimana pengalaman belanja kamu? Klik link ini untuk memberi review: {reviewLink}",
      popupEnabled: true,
      popupMinSessions: 2,
      popupMinDaysSinceFirstSeen: 3,
      popupMinSecondsOnSite: 45,
      popupCooldownDays: 14,
      popupMaxImpressionsPerWindow: 3,
      popupOnlyIfEligibleOrdersExist: true,
      popupTitle: "Bagaimana pengalaman belanjamu?",
      popupBody: "Kami ingin mendengar pendapat kamu tentang produk dan layanan kami!",
      successMessage: "Terima kasih atas review kamu! 🎉",
      myOrdersReviewEnabled: true,
      showReviewForLastNOrders: 5,
      allowResubmitOnRejected: false,
      ratingRequired: true,
      minMessageLength: 10,
      maxMessageLength: 500,
    },
  })

  console.log("📂 Creating Categories...")
  const catPakaian = await prisma.category.create({ data: { name: "Pakaian", slug: "pakaian", isActive: true } })
  const catSepatu = await prisma.category.create({ data: { name: "Sepatu", slug: "sepatu", isActive: true } })
  const catTas = await prisma.category.create({ data: { name: "Tas", slug: "tas", isActive: true } })
  const catElektronik = await prisma.category.create({ data: { name: "Elektronik", slug: "elektronik", isActive: true } })
  const catAksesoris = await prisma.category.create({ data: { name: "Aksesoris", slug: "aksesoris", isActive: true } })

  console.log("🛍️ Creating Products with images...")

  async function createProductWithImage(data: {
    name: string; slug: string; description: string; categoryId: string;
    isPopular: boolean; categoryKey: string; imageLabel: string;
    variants: { name: string; sku: string; price: number; stock: number; sortOrder: number }[]
  }) {
    const img = generateProductImage(data.categoryKey, data.imageLabel)
    const product = await prisma.product.create({
      data: {
        name: data.name, slug: data.slug, description: data.description,
        categoryId: data.categoryId, isActive: true, isPopular: data.isPopular,
        images: {
          create: [{
            base64: img.base64, mimeType: img.mimeType,
            size: img.size, name: img.name, sortOrder: 0,
          }],
        },
        variants: { create: data.variants },
      },
    })
    return product
  }

  const p1 = await createProductWithImage({
    name: "Kaos Polos Premium Cotton Combed 30s", slug: "kaos-polos-premium-cotton-combed-30s",
    description: "Kaos polos premium dengan bahan cotton combed 30s yang lembut dan nyaman dipakai seharian. Jahitan rapi double stitch pada bagian leher dan lengan. Tersedia dalam berbagai ukuran dari S hingga XXL. Cocok untuk kegiatan sehari-hari maupun dipadupadankan dengan outfit kasual.",
    categoryId: catPakaian.id, isPopular: true, categoryKey: "pakaian", imageLabel: "KAOS POLOS",
    variants: [
      { name: "S", sku: "KP-S", price: 89000, stock: 120, sortOrder: 0 },
      { name: "M", sku: "KP-M", price: 89000, stock: 200, sortOrder: 1 },
      { name: "L", sku: "KP-L", price: 89000, stock: 180, sortOrder: 2 },
      { name: "XL", sku: "KP-XL", price: 99000, stock: 150, sortOrder: 3 },
      { name: "XXL", sku: "KP-XXL", price: 109000, stock: 80, sortOrder: 4 },
    ],
  })

  const p2 = await createProductWithImage({
    name: "Kemeja Flannel Kotak Premium", slug: "kemeja-flannel-kotak-premium",
    description: "Kemeja flannel motif kotak dengan bahan tebal berkualitas tinggi. Nyaman digunakan saat cuaca sejuk. Dilengkapi dengan kancing kokoh dan saku dada. Material lembut yang tidak membuat gerah.",
    categoryId: catPakaian.id, isPopular: true, categoryKey: "pakaian", imageLabel: "KEMEJA FLANNEL",
    variants: [
      { name: "Merah", sku: "KF-RED", price: 189000, stock: 45, sortOrder: 0 },
      { name: "Biru", sku: "KF-BLU", price: 189000, stock: 60, sortOrder: 1 },
      { name: "Hijau", sku: "KF-GRN", price: 189000, stock: 35, sortOrder: 2 },
      { name: "Abu-abu", sku: "KF-GRY", price: 189000, stock: 50, sortOrder: 3 },
    ],
  })

  const p3 = await createProductWithImage({
    name: "Hoodie Pullover Fleece Tebal", slug: "hoodie-pullover-fleece-tebal",
    description: "Hoodie pullover dengan bahan fleece premium yang tebal dan hangat. Dilengkapi dengan hoodie adjustable, kantong kanguru, dan rib pada bagian lengan serta pinggang. Perfect untuk musim hujan.",
    categoryId: catPakaian.id, isPopular: false, categoryKey: "pakaian", imageLabel: "HOODIE FLEECE",
    variants: [
      { name: "Hitam", sku: "HD-BLK", price: 259000, stock: 70, sortOrder: 0 },
      { name: "Navy", sku: "HD-NVY", price: 259000, stock: 55, sortOrder: 1 },
      { name: "Maroon", sku: "HD-MRN", price: 259000, stock: 40, sortOrder: 2 },
      { name: "Cream", sku: "HD-CRM", price: 269000, stock: 30, sortOrder: 3 },
      { name: "Olive", sku: "HD-OLV", price: 259000, stock: 25, sortOrder: 4 },
      { name: "Misty", sku: "HD-MST", price: 259000, stock: 45, sortOrder: 5 },
    ],
  })

  const p4 = await createProductWithImage({
    name: "Celana Chino Slim Fit", slug: "celana-chino-slim-fit",
    description: "Celana chino slim fit dengan bahan stretch yang nyaman dan tidak kaku. Cutting modern yang cocok untuk tampilan formal maupun semi-casual. Dilengkapi dengan kancing YKK dan zipper premium.",
    categoryId: catPakaian.id, isPopular: false, categoryKey: "pakaian", imageLabel: "CELANA CHINO",
    variants: [
      { name: "28", sku: "CC-28", price: 229000, stock: 30, sortOrder: 0 },
      { name: "29", sku: "CC-29", price: 229000, stock: 40, sortOrder: 1 },
      { name: "30", sku: "CC-30", price: 229000, stock: 55, sortOrder: 2 },
      { name: "31", sku: "CC-31", price: 229000, stock: 45, sortOrder: 3 },
      { name: "32", sku: "CC-32", price: 229000, stock: 40, sortOrder: 4 },
      { name: "33", sku: "CC-33", price: 239000, stock: 25, sortOrder: 5 },
      { name: "34", sku: "CC-34", price: 239000, stock: 20, sortOrder: 6 },
    ],
  })

  const p5 = await createProductWithImage({
    name: "Sepatu Sneakers Casual Urban", slug: "sepatu-sneakers-casual-urban",
    description: "Sneakers casual dengan desain urban yang modern. Upper berbahan canvas premium dengan sol rubber anti-slip. Insole empuk untuk kenyamanan. Cocok untuk jalan-jalan, hangout, maupun ke kampus.",
    categoryId: catSepatu.id, isPopular: true, categoryKey: "sepatu", imageLabel: "SNEAKERS URBAN",
    variants: [
      { name: "39", sku: "SN-39", price: 349000, stock: 25, sortOrder: 0 },
      { name: "40", sku: "SN-40", price: 349000, stock: 40, sortOrder: 1 },
      { name: "41", sku: "SN-41", price: 349000, stock: 50, sortOrder: 2 },
      { name: "42", sku: "SN-42", price: 349000, stock: 45, sortOrder: 3 },
      { name: "43", sku: "SN-43", price: 349000, stock: 35, sortOrder: 4 },
      { name: "44", sku: "SN-44", price: 349000, stock: 20, sortOrder: 5 },
    ],
  })

  const p6 = await createProductWithImage({
    name: "Sepatu Running Ultra Boost", slug: "sepatu-running-ultra-boost",
    description: "Sepatu running dengan teknologi boost pada sol tengah. Upper mesh knit ringan dan breathable. Continental rubber outsole untuk grip optimal. Ideal untuk lari harian maupun marathon.",
    categoryId: catSepatu.id, isPopular: false, categoryKey: "sepatu", imageLabel: "RUNNING BOOST",
    variants: [
      { name: "40", sku: "RN-40", price: 599000, stock: 20, sortOrder: 0 },
      { name: "41", sku: "RN-41", price: 599000, stock: 30, sortOrder: 1 },
      { name: "42", sku: "RN-42", price: 599000, stock: 35, sortOrder: 2 },
      { name: "43", sku: "RN-43", price: 599000, stock: 25, sortOrder: 3 },
      { name: "44", sku: "RN-44", price: 599000, stock: 15, sortOrder: 4 },
    ],
  })

  const p7 = await createProductWithImage({
    name: "Tas Ransel Laptop Anti Air", slug: "tas-ransel-laptop-anti-air",
    description: "Tas ransel dengan bahan nylon anti air dan kompartemen laptop hingga 15.6 inch. Dilengkapi port USB charging external, tali bahu ergonomis dengan bantalan tebal.",
    categoryId: catTas.id, isPopular: true, categoryKey: "tas", imageLabel: "RANSEL LAPTOP",
    variants: [
      { name: "Hitam", sku: "TR-BLK", price: 289000, stock: 60, sortOrder: 0 },
      { name: "Abu-abu", sku: "TR-GRY", price: 289000, stock: 45, sortOrder: 1 },
      { name: "Navy", sku: "TR-NVY", price: 299000, stock: 35, sortOrder: 2 },
    ],
  })

  const p8 = await createProductWithImage({
    name: "Tote Bag Canvas Premium", slug: "tote-bag-canvas-premium",
    description: "Tote bag berbahan canvas tebal dengan jahitan kokoh. Ukuran besar yang muat banyak barang. Desain minimalis yang cocok untuk segala occasion. Mudah dicuci dan tahan lama.",
    categoryId: catTas.id, isPopular: false, categoryKey: "tas", imageLabel: "TOTE BAG CANVAS",
    variants: [
      { name: "Natural", sku: "TB-NAT", price: 129000, stock: 100, sortOrder: 0 },
      { name: "Hitam", sku: "TB-BLK", price: 129000, stock: 80, sortOrder: 1 },
      { name: "Cream", sku: "TB-CRM", price: 139000, stock: 60, sortOrder: 2 },
    ],
  })

  const p9 = await createProductWithImage({
    name: "Earbuds TWS Active Noise Cancelling", slug: "earbuds-tws-anc",
    description: "True wireless earbuds dengan ANC yang meredam kebisingan hingga 35dB. Driver 12mm titanium untuk suara jernih dan bass dalam. Battery 30 jam. IPX5 waterproof.",
    categoryId: catElektronik.id, isPopular: true, categoryKey: "elektronik", imageLabel: "TWS EARBUDS",
    variants: [
      { name: "Midnight Black", sku: "EB-MBK", price: 499000, stock: 50, sortOrder: 0 },
      { name: "Pearl White", sku: "EB-PW", price: 499000, stock: 40, sortOrder: 1 },
      { name: "Forest Green", sku: "EB-FG", price: 519000, stock: 25, sortOrder: 2 },
    ],
  })

  const p10 = await createProductWithImage({
    name: "Smartwatch Fitness Tracker Pro", slug: "smartwatch-fitness-tracker-pro",
    description: "Smartwatch AMOLED 1.43 inch. Heart rate, SpO2, sleep tracking, GPS, 100+ mode olahraga. Water resistant 5ATM. Battery 14 hari. Android & iOS compatible.",
    categoryId: catElektronik.id, isPopular: false, categoryKey: "elektronik", imageLabel: "SMARTWATCH PRO",
    variants: [
      { name: "Black Strap", sku: "SW-BLK", price: 899000, stock: 30, sortOrder: 0 },
      { name: "Green Strap", sku: "SW-GRN", price: 899000, stock: 20, sortOrder: 1 },
      { name: "Blue Strap", sku: "SW-BLU", price: 899000, stock: 25, sortOrder: 2 },
      { name: "Pink Strap", sku: "SW-PNK", price: 899000, stock: 15, sortOrder: 3 },
    ],
  })

  const p11 = await createProductWithImage({
    name: "Gelang Titanium Minimalis", slug: "gelang-titanium-minimalis",
    description: "Gelang titanium grade 5 yang ringan, anti karat, dan hypoallergenic. Desain minimalis dan elegan. Clasp magnet. Cocok pria dan wanita. Box eksklusif.",
    categoryId: catAksesoris.id, isPopular: false, categoryKey: "aksesoris", imageLabel: "GELANG TITANIUM",
    variants: [
      { name: "Silver", sku: "GT-SLV", price: 179000, stock: 40, sortOrder: 0 },
      { name: "Black", sku: "GT-BLK", price: 179000, stock: 35, sortOrder: 1 },
      { name: "Rose Gold", sku: "GT-RG", price: 199000, stock: 25, sortOrder: 2 },
      { name: "Gold", sku: "GT-GLD", price: 199000, stock: 20, sortOrder: 3 },
    ],
  })

  const p12 = await createProductWithImage({
    name: "Kacamata UV400 Polarized", slug: "kacamata-uv400-polarized",
    description: "Kacamata lensa polarized UV400 pelindung sinar UV. Frame TR90 super ringan dan fleksibel. Desain unisex. Termasuk hard case dan microfiber cloth.",
    categoryId: catAksesoris.id, isPopular: true, categoryKey: "aksesoris", imageLabel: "KACAMATA UV400",
    variants: [
      { name: "Black", sku: "KC-BLK", price: 159000, stock: 55, sortOrder: 0 },
      { name: "Tortoise", sku: "KC-TRT", price: 159000, stock: 40, sortOrder: 1 },
      { name: "Blue Mirror", sku: "KC-BLM", price: 179000, stock: 30, sortOrder: 2 },
    ],
  })

  console.log("👥 Creating Users...")
  const admin = await prisma.userProfile.create({
    data: {
      supabaseUserId: "admin-supabase-id-001", email: "admin@zincstore.id",
      fullName: "Admin Zinc", phone: "6281234567890", city: "Jakarta",
      address: "Jl. Gatot Subroto Kav. 36-38, Kuningan, Jakarta Selatan", role: "SUPERADMIN",
    },
  })

  const users = await Promise.all([
    prisma.userProfile.create({ data: { supabaseUserId: "user-001", email: "budi.santoso@gmail.com", fullName: "Budi Santoso", phone: "6281345678901", city: "Bandung", address: "Jl. Dago No. 45, Coblong, Bandung 40135", role: "USER" } }),
    prisma.userProfile.create({ data: { supabaseUserId: "user-002", email: "siti.nurhaliza@gmail.com", fullName: "Siti Nurhaliza", phone: "6282456789012", city: "Surabaya", address: "Jl. Pemuda No. 78, Tegalsari, Surabaya 60271", role: "USER" } }),
    prisma.userProfile.create({ data: { supabaseUserId: "user-003", email: "andi.wijaya@gmail.com", fullName: "Andi Wijaya", phone: "6283567890123", city: "Yogyakarta", address: "Jl. Malioboro No. 12, Gedongtengen, Yogyakarta 55271", role: "USER" } }),
    prisma.userProfile.create({ data: { supabaseUserId: "user-004", email: "dewi.lestari@gmail.com", fullName: "Dewi Lestari", phone: "6284678901234", city: "Semarang", address: "Jl. Pandanaran No. 56, Semarang Tengah, Semarang 50134", role: "USER" } }),
    prisma.userProfile.create({ data: { supabaseUserId: "user-005", email: "reza.mahendra@gmail.com", fullName: "Reza Mahendra", phone: "6285789012345", city: "Malang", address: "Jl. Ijen No. 23, Klojen, Malang 65119", role: "USER" } }),
  ])

  console.log("📋 Creating Orders...")
  const getVariant = async (productId: string, name: string) =>
    (await prisma.productVariant.findFirst({ where: { productId, name } }))!

  const v = {
    kaosL: await getVariant(p1.id, "L"),
    kaosM: await getVariant(p1.id, "M"),
    flannelBiru: await getVariant(p2.id, "Biru"),
    hoodieHitam: await getVariant(p3.id, "Hitam"),
    sneakers42: await getVariant(p5.id, "42"),
    running41: await getVariant(p6.id, "41"),
    ranselHitam: await getVariant(p7.id, "Hitam"),
    toteNatural: await getVariant(p8.id, "Natural"),
    earbud: await getVariant(p9.id, "Midnight Black"),
    watch: await getVariant(p10.id, "Black Strap"),
    gelangSilver: await getVariant(p11.id, "Silver"),
    kacamata: await getVariant(p12.id, "Black"),
    chino30: await getVariant(p4.id, "30"),
    ranselNavy: await getVariant(p7.id, "Navy"),
  }

  const order1 = await prisma.order.create({
    data: {
      userId: users[0].id, orderNumber: "ORD-2025-0001",
      buyerName: users[0].fullName, buyerPhone: users[0].phone!,
      buyerAddress: users[0].address!, buyerNote: "Tolong packing rapi ya kak, ini untuk kado",
      subtotal: 437000, status: "SUCCEEDED",
      items: { create: [
        { productId: p1.id, variantId: v.kaosL.id, productName: p1.name, variantName: "L", quantity: 2, unitPrice: 89000, lineTotal: 178000 },
        { productId: p3.id, variantId: v.hoodieHitam.id, productName: p3.name, variantName: "Hitam", quantity: 1, unitPrice: 259000, lineTotal: 259000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order1.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order1.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran via BCA dikonfirmasi" },
    { orderId: order1.id, from: "CONFIRMED", to: "SHIPPING", changedBy: admin.id, note: "Dikirim via JNE REG - Resi: JN123456789" },
    { orderId: order1.id, from: "SHIPPING", to: "SUCCEEDED", changedBy: admin.id, note: "Barang diterima" },
  ] })

  const order2 = await prisma.order.create({
    data: {
      userId: users[1].id, orderNumber: "ORD-2025-0002",
      buyerName: users[1].fullName, buyerPhone: users[1].phone!,
      buyerAddress: users[1].address!, buyerNote: "Kirim yang cepat ya kak",
      subtotal: 848000, status: "SUCCEEDED",
      items: { create: [
        { productId: p5.id, variantId: v.sneakers42.id, productName: p5.name, variantName: "42", quantity: 1, unitPrice: 349000, lineTotal: 349000 },
        { productId: p9.id, variantId: v.earbud.id, productName: p9.name, variantName: "Midnight Black", quantity: 1, unitPrice: 499000, lineTotal: 499000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order2.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order2.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran via GoPay dikonfirmasi" },
    { orderId: order2.id, from: "CONFIRMED", to: "SHIPPING", changedBy: admin.id, note: "Dikirim via SiCepat - Resi: SC987654321" },
    { orderId: order2.id, from: "SHIPPING", to: "SUCCEEDED", changedBy: admin.id, note: "Barang sampai dan diterima customer" },
  ] })

  const order3 = await prisma.order.create({
    data: {
      userId: users[2].id, orderNumber: "ORD-2025-0003",
      buyerName: users[2].fullName, buyerPhone: users[2].phone!,
      buyerAddress: users[2].address!,
      subtotal: 578000, status: "SHIPPING",
      items: { create: [
        { productId: p7.id, variantId: v.ranselHitam.id, productName: p7.name, variantName: "Hitam", quantity: 1, unitPrice: 289000, lineTotal: 289000 },
        { productId: p7.id, variantId: v.ranselNavy.id, productName: p7.name, variantName: "Navy", quantity: 1, unitPrice: 299000, lineTotal: 299000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order3.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order3.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran via BNI dikonfirmasi" },
    { orderId: order3.id, from: "CONFIRMED", to: "SHIPPING", changedBy: admin.id, note: "Dikirim via J&T Express - Resi: JT456789012" },
  ] })

  const order4 = await prisma.order.create({
    data: {
      userId: users[3].id, orderNumber: "ORD-2025-0004",
      buyerName: users[3].fullName, buyerPhone: users[3].phone!,
      buyerAddress: users[3].address!, buyerNote: "Warna biru ya kak",
      subtotal: 189000, status: "CONFIRMED",
      items: { create: [
        { productId: p2.id, variantId: v.flannelBiru.id, productName: p2.name, variantName: "Biru", quantity: 1, unitPrice: 189000, lineTotal: 189000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order4.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order4.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran via Mandiri dikonfirmasi" },
  ] })

  const order5 = await prisma.order.create({
    data: {
      userId: users[4].id, orderNumber: "ORD-2025-0005",
      buyerName: users[4].fullName, buyerPhone: users[4].phone!,
      buyerAddress: users[4].address!,
      subtotal: 338000, status: "PENDING",
      items: { create: [
        { productId: p11.id, variantId: v.gelangSilver.id, productName: p11.name, variantName: "Silver", quantity: 1, unitPrice: 179000, lineTotal: 179000 },
        { productId: p12.id, variantId: v.kacamata.id, productName: p12.name, variantName: "Black", quantity: 1, unitPrice: 159000, lineTotal: 159000 },
      ] },
    },
  })
  await prisma.orderStatusLog.create({ data: { orderId: order5.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat, menunggu pembayaran" } })

  const order6 = await prisma.order.create({
    data: {
      userId: users[0].id, orderNumber: "ORD-2025-0006",
      buyerName: users[0].fullName, buyerPhone: users[0].phone!,
      buyerAddress: users[0].address!, buyerNote: "Cancel ya kak, salah pilih ukuran",
      subtotal: 229000, status: "CANCELED",
      items: { create: [
        { productId: p4.id, variantId: v.chino30.id, productName: p4.name, variantName: "30", quantity: 1, unitPrice: 229000, lineTotal: 229000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order6.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order6.id, from: "PENDING", to: "CANCELED", changedBy: admin.id, note: "Dibatalkan atas permintaan customer - salah ukuran" },
  ] })

  const order7 = await prisma.order.create({
    data: {
      userId: users[2].id, orderNumber: "ORD-2025-0007",
      buyerName: users[2].fullName, buyerPhone: users[2].phone!,
      buyerAddress: users[2].address!,
      subtotal: 258000, status: "SUCCEEDED",
      items: { create: [
        { productId: p8.id, variantId: v.toteNatural.id, productName: p8.name, variantName: "Natural", quantity: 2, unitPrice: 129000, lineTotal: 258000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order7.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order7.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran via GoPay dikonfirmasi" },
    { orderId: order7.id, from: "CONFIRMED", to: "SHIPPING", changedBy: admin.id, note: "Dikirim via Anteraja - Resi: AJ789012345" },
    { orderId: order7.id, from: "SHIPPING", to: "SUCCEEDED", changedBy: admin.id, note: "Barang diterima" },
  ] })

  const order8 = await prisma.order.create({
    data: {
      userId: users[3].id, orderNumber: "ORD-2025-0008",
      buyerName: users[3].fullName, buyerPhone: users[3].phone!,
      buyerAddress: users[3].address!,
      subtotal: 599000, status: "SUCCEEDED",
      items: { create: [
        { productId: p6.id, variantId: v.running41.id, productName: p6.name, variantName: "41", quantity: 1, unitPrice: 599000, lineTotal: 599000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order8.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order8.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran dikonfirmasi" },
    { orderId: order8.id, from: "CONFIRMED", to: "SHIPPING", changedBy: admin.id, note: "Dikirim via JNE YES - Resi: JY112233445" },
    { orderId: order8.id, from: "SHIPPING", to: "SUCCEEDED", changedBy: admin.id, note: "Diterima customer" },
  ] })

  const order9 = await prisma.order.create({
    data: {
      userId: users[1].id, orderNumber: "ORD-2025-0009",
      buyerName: users[1].fullName, buyerPhone: users[1].phone!,
      buyerAddress: users[1].address!, buyerNote: "Minta bubble wrap ya",
      subtotal: 1188000, status: "SUCCEEDED",
      items: { create: [
        { productId: p10.id, variantId: v.watch.id, productName: p10.name, variantName: "Black Strap", quantity: 1, unitPrice: 899000, lineTotal: 899000 },
        { productId: p7.id, variantId: v.ranselHitam.id, productName: p7.name, variantName: "Hitam", quantity: 1, unitPrice: 289000, lineTotal: 289000 },
      ] },
    },
  })
  await prisma.orderStatusLog.createMany({ data: [
    { orderId: order9.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat" },
    { orderId: order9.id, from: "PENDING", to: "CONFIRMED", changedBy: admin.id, note: "Pembayaran via DANA dikonfirmasi" },
    { orderId: order9.id, from: "CONFIRMED", to: "SHIPPING", changedBy: admin.id, note: "Dikirim via SiCepat BEST - Resi: SB998877665" },
    { orderId: order9.id, from: "SHIPPING", to: "SUCCEEDED", changedBy: admin.id, note: "Barang diterima dalam kondisi baik" },
  ] })

  const order10 = await prisma.order.create({
    data: {
      userId: users[4].id, orderNumber: "ORD-2025-0010",
      buyerName: users[4].fullName, buyerPhone: users[4].phone!,
      buyerAddress: users[4].address!,
      subtotal: 178000, status: "PENDING",
      items: { create: [
        { productId: p1.id, variantId: v.kaosM.id, productName: p1.name, variantName: "M", quantity: 2, unitPrice: 89000, lineTotal: 178000 },
      ] },
    },
  })
  await prisma.orderStatusLog.create({ data: { orderId: order10.id, from: "PENDING", to: "PENDING", changedBy: "system", note: "Pesanan dibuat, menunggu pembayaran" } })

  console.log("⭐ Creating Testimonials...")
  await prisma.testimonial.createMany({
    data: [
      { userId: users[0].id, orderId: order1.id, rating: 5, message: "Kaosnya super nyaman! Bahan cotton combed-nya lembut banget di kulit dan ukurannya pas sesuai chart. Hoodie-nya juga tebal dan hangat banget. Packing rapi, 100% recommended! Pasti beli lagi di Zinc Store 🔥", status: "APPROVED", source: "MY_ORDERS", approvedAt: new Date() },
      { userId: users[1].id, orderId: order2.id, rating: 5, message: "Sepatu sneakers-nya keren banget! Ringan dan nyaman buat jalan seharian. Earbuds TWS-nya juga mantap, suara jernih dan bass nendang. ANC works great! Worth every penny. Pengiriman cepat 2 hari sampai!", status: "APPROVED", source: "MY_ORDERS", approvedAt: new Date() },
      { userId: users[2].id, orderId: order7.id, rating: 4, message: "Tote bag canvas-nya bagus, bahannya tebal dan kokoh. Ukurannya pas buat bawa laptop dan buku. Jahitan rapi. Satu hal yang bisa ditingkatkan mungkin variasi warnanya. Overall puas!", status: "APPROVED", source: "MAGIC_LINK", approvedAt: new Date() },
      { userId: users[3].id, orderId: order8.id, rating: 5, message: "Sepatu running-nya ringan banget! Super empuk dan nyaman buat lari pagi. Designnya juga keren. Pengiriman cepat pakai JNE YES, sampai dalam 1 hari. Packaging aman. Terima kasih Zinc Store! ❤️", status: "APPROVED", source: "MY_ORDERS", approvedAt: new Date() },
      { userId: users[1].id, orderId: order9.id, rating: 5, message: "Smartwatch-nya fiturnya lengkap banget! Layar AMOLED jernih, heart rate akurat, battery awet 2 minggu. Tas ranselnya juga kualitas premium, bahan anti air beneran. Zinc Store the best! 💯", status: "APPROVED", source: "MY_ORDERS", approvedAt: new Date() },
      { userId: users[4].id, orderId: order5.id, rating: 3, message: "Barang belum sampai, masih menunggu konfirmasi pembayaran. Semoga bisa diproses segera.", status: "PENDING", source: "POPUP" },
    ],
  })

  console.log("❓ Creating FAQs...")
  await prisma.fAQ.createMany({
    data: [
      { question: "Bagaimana cara memesan produk di Zinc Store?", answer: "Pilih produk yang diinginkan, pilih variant/ukuran, lalu klik 'Tambah ke Keranjang' atau 'Beli Sekarang'. Setelah itu, isi data pengiriman dan konfirmasi pesanan melalui WhatsApp.", sortOrder: 1, isActive: true },
      { question: "Berapa lama pengiriman pesanan saya?", answer: "Pesanan akan diproses dalam 1-2 hari kerja setelah pembayaran dikonfirmasi. Estimasi pengiriman adalah 2-5 hari kerja untuk Pulau Jawa dan 5-10 hari kerja untuk luar Pulau Jawa, tergantung jasa ekspedisi yang dipilih.", sortOrder: 2, isActive: true },
      { question: "Metode pembayaran apa saja yang tersedia?", answer: "Kami menerima pembayaran melalui transfer bank (BCA, BNI, BRI, Mandiri), e-wallet (GoPay, OVO, DANA, ShopeePay), dan QRIS. Pembayaran dikonfirmasi melalui WhatsApp.", sortOrder: 3, isActive: true },
      { question: "Apakah bisa tukar ukuran atau retur barang?", answer: "Ya, kami menerima penukaran ukuran dalam 7 hari setelah barang diterima dengan syarat barang masih dalam kondisi baru/belum digunakan dan tag masih terpasang. Ongkos kirim retur ditanggung pembeli.", sortOrder: 4, isActive: true },
      { question: "Bagaimana cara mengetahui ukuran yang tepat?", answer: "Setiap produk clothing memiliki size chart yang bisa dilihat di halaman detail produk. Jika ragu, silakan konsultasikan dengan CS kami via WhatsApp dengan menyebutkan tinggi badan dan berat badan Anda.", sortOrder: 5, isActive: true },
      { question: "Apakah foto produk sesuai dengan aslinya?", answer: "Kami berusaha menampilkan foto produk seakurat mungkin. Namun, perbedaan warna minor mungkin terjadi karena perbedaan setting layar perangkat Anda.", sortOrder: 6, isActive: true },
      { question: "Apakah ada garansi untuk produk elektronik?", answer: "Ya, semua produk elektronik mendapatkan garansi resmi 1 tahun dari tanggal pembelian. Klaim garansi dapat dilakukan dengan menghubungi CS kami dan menyertakan bukti pembelian.", sortOrder: 7, isActive: true },
      { question: "Bagaimana cara memberikan review/ulasan?", answer: "Setelah pesanan Anda berstatus 'Selesai', Anda bisa memberikan review melalui halaman 'Pesanan Saya' atau melalui link review yang dikirim via WhatsApp.", sortOrder: 8, isActive: true },
    ],
  })

  console.log(`
  ✅ Database seeded successfully!
  
  📊 Summary:
  - 1 Store Configuration (with full Terms & Privacy Policy)
  - 1 Review Settings
  - 5 Categories
  - 12 Products with images and 50+ variants
  - 6 Users (1 SuperAdmin + 5 Customers)
  - 10 Orders (4 SUCCEEDED, 1 SHIPPING, 1 CONFIRMED, 2 PENDING, 1 CANCELED)
  - 6 Testimonials (5 Approved + 1 Pending)
  - 8 FAQs
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
