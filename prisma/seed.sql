-- SQL Seed Data for Zinc Store (PostgreSQL)
-- Run this in your Supabase SQL Editor or psql to populate the database.

-- 1. Store Configuration
DELETE FROM "StoreConfig";
INSERT INTO "StoreConfig" (
  "id", "storeName", "storeCity", "heroHeadline", "heroSubheadline", 
  "heroCtaText", "heroCtaHref", "companyName", "companyAbout", 
  "companyAddress", "supportEmail", "whatsappSupport", "whatsappAdmin", 
  "whatsappTemplate", "termsTitle", "termsContent", "updatedAt"
) VALUES (
  'config_seed_01', 
  'Zinc Store', 
  'Jakarta', 
  'Premium E-Commerce Experience', 
  'Discover our curated collection of high-quality products. Designed for excellence, built for you.', 
  'Shop Now', 
  '/products', 
  'Zinc Store Indonesia', 
  'Premium products curated for you. Quality guaranteed since 2024.', 
  'Jakarta, Indonesia', 
  'support@zincstore.com', 
  '628123456789', 
  '628987654321', 
  'Halo Zinc Store! Saya {customerName} ingin memesan:', 
  'Terms & Conditions', 
  'By using our service, you agree to our terms and conditions.',
  NOW()
) ON CONFLICT DO NOTHING;

-- 2. Review System Settings
DELETE FROM "ReviewSettings";
INSERT INTO "ReviewSettings" (
  "id", "reviewsEnabled", "requireOrderSucceeded", "oneReviewPerOrder", 
  "reviewWindowDays", "moderationRequired", "tokenExpiryHours", 
  "allowTokenRegenerate", "waTemplate", "popupEnabled", "popupMinSessions", 
  "popupMinDaysSinceFirstSeen", "popupMinSecondsOnSite", "popupCooldownDays", 
  "popupMaxImpressionsPerWindow", "popupOnlyIfEligibleOrdersExist", 
  "popupTitle", "popupBody", "successMessage", "myOrdersReviewEnabled", 
  "showReviewForLastNOrders", "allowResubmitOnRejected", 
  "ratingRequired", "minMessageLength", "maxMessageLength", "updatedAt"
) VALUES (
  'settings_seed_01', 
  true, true, true, 30, true, 
  720, true, 
  'Halo {customerName}! Terima kasih atas pesanan {orderCode}. Kami ingin mendengar pengalaman Anda. Klik link ini untuk memberi review: {reviewLink}', 
  true, 2, 3, 45, 14, 3, true, 
  'Bagaimana pengalaman Anda?', 
  'Kami ingin mendengar pendapat Anda tentang toko kami!', 
  'Terima kasih atas review Anda!', 
  true, 5, false, 
  true, 10, 300, 
  NOW()
) ON CONFLICT DO NOTHING;

-- 3. Categories
INSERT INTO "Category" ("id", "name", "slug", "isActive", "updatedAt") VALUES
('cat_clothing_01', 'Clothing', 'clothing', true, NOW()),
('cat_electronics_01', 'Electronics', 'electronics', true, NOW()),
('cat_accessories_01', 'Accessories', 'accessories', true, NOW())
ON CONFLICT ("slug") DO UPDATE SET "isActive" = true;

-- 4. Sample Products & Variants
-- Product 1: T-Shirt
INSERT INTO "Product" ("id", "name", "slug", "description", "categoryId", "isActive", "updatedAt") 
VALUES ('prod_tshirt_01', 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'High-quality 100% cotton t-shirt with modern fit.', 'cat_clothing_01', true, NOW())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "ProductVariant" ("id", "productId", "name", "sku", "price", "stock", "isActive", "sortOrder", "updatedAt") VALUES
('var_tshirt_blk_s', 'prod_tshirt_01', 'Black - Small', 'TSHIRT-BLK-S', 199000, 50, true, 0, NOW()),
('var_tshirt_blk_m', 'prod_tshirt_01', 'Black - Medium', 'TSHIRT-BLK-M', 199000, 75, true, 1, NOW()),
('var_tshirt_wht_m', 'prod_tshirt_01', 'White - Medium', 'TSHIRT-WHT-M', 199000, 80, true, 2, NOW())
ON CONFLICT ("sku") DO NOTHING;

-- Product 2: Earbuds
INSERT INTO "Product" ("id", "name", "slug", "description", "categoryId", "isActive", "updatedAt") 
VALUES ('prod_earbuds_01', 'Wireless Earbuds Pro', 'wireless-earbuds-pro', 'Premium wireless earbuds with active noise cancellation.', 'cat_electronics_01', true, NOW())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "ProductVariant" ("id", "productId", "name", "sku", "price", "stock", "isActive", "sortOrder", "updatedAt") VALUES
('var_buds_blk', 'prod_earbuds_01', 'Black Edition', 'BUDS-BLK', 899000, 30, true, 0, NOW())
ON CONFLICT ("sku") DO NOTHING;

-- 5. Sample User
INSERT INTO "UserProfile" ("id", "supabaseUserId", "email", "fullName", "phone", "city", "address", "role", "updatedAt") 
VALUES ('user_seed_01', 'auth_user_seed_123', 'guest@zincstore.com', 'Sarah Jenkins', '08123456789', 'Jakarta', 'Jl. Sudirman 123', 'USER', NOW())
ON CONFLICT ("supabaseUserId") DO NOTHING;

-- 6. Sample Order (Succeeded)
INSERT INTO "Order" ("id", "orderNumber", "userId", "status", "buyerName", "buyerPhone", "buyerAddress", "subtotal", "updatedAt") 
VALUES ('order_seed_01', 'ORD-2024-001', 'user_seed_01', 'SUCCEEDED', 'Sarah Jenkins', '08123456789', 'Jl. Sudirman 123', 398000, NOW())
ON CONFLICT ("orderNumber") DO NOTHING;

INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "variantName", "unitPrice", "quantity", "lineTotal") 
VALUES ('item_seed_01', 'order_seed_01', 'prod_tshirt_01', 'var_tshirt_blk_m', 'Premium Cotton T-Shirt', 'Black - Medium', 199000, 2, 398000)
ON CONFLICT DO NOTHING;

-- 7. Sample Testimonial (Approved)
INSERT INTO "Testimonial" ("id", "orderId", "userId", "rating", "message", "status", "source", "submittedAt", "approvedAt", "updatedAt") 
VALUES (
  'review_seed_01', 
  'order_seed_01', 
  'user_seed_01', 
  5, 
  'Absolutely love the quality! The fabric is so soft and breathable. Will definitely buy again.', 
  'APPROVED', 
  'MY_ORDERS', 
  NOW(), 
  NOW(), 
  NOW()
) ON CONFLICT ("orderId") DO NOTHING;

