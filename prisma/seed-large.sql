-- LARGE SEED DATA FOR ZINC STORE
-- Executes a full reset and population of the database.

-- WARNING: This will clear existing data in the tables below!
TRUNCATE TABLE "Testimonial", "OrderItem", "Order", "CartItem", "Cart", "ProductVariant", "ProductImage", "Product", "Category", "UserProfile", "StoreConfig", "ReviewSettings" CASCADE;

-- 1. Store Config & Settings
INSERT INTO "StoreConfig" (
  "id", "storeName", "storeCity", "heroHeadline", "heroSubheadline", 
  "heroCtaText", "heroCtaHref", "companyName", "companyAbout", "companyAddress", 
  "supportEmail", "whatsappSupport", "whatsappAdmin", "whatsappTemplate", 
  "termsTitle", "termsContent", "updatedAt"
) 
VALUES (
  'config_01', 'Zinc Store', 'Jakarta', 'Redefining Modern Lifestyle', 
  'Curated collection of premium fashion and tech essentials.', 'Shop Collection', 
  '/products', 'Zinc Corp', 'Since 2024', 'Jl. Sudirman No 1, Jakarta', 
  'support@zincstore.com', '628123456789', '628987654321', 
  'Halo Zinc Store! Saya {customerName} ingin memesan:', 
  'Terms & Conditions', 'By using our service, you agree to our terms.', 
  NOW()
);

INSERT INTO "ReviewSettings" ("id", "reviewsEnabled", "moderationRequired", "updatedAt") 
VALUES ('settings_01', true, false, NOW()); -- Auto-approve for demo

-- 2. Categories
INSERT INTO "Category" ("id", "name", "slug", "updatedAt") VALUES
('cat_men', 'Men''s Fashion', 'mens-fashion', NOW()),
('cat_women', 'Women''s Fashion', 'womens-fashion', NOW()),
('cat_tech', 'Electronics', 'electronics', NOW()),
('cat_acc', 'Accessories', 'accessories', NOW());

-- 3. Products & Variants

-- Men's Fashion
INSERT INTO "Product" ("id", "categoryId", "name", "slug", "description", "updatedAt") VALUES
('p_m_tee', 'cat_men', 'Essential Cotton Tee', 'essential-cotton-tee', 'Heavyweight 100% organic cotton t-shirt. Boxy fit.', NOW()),
('p_m_jacket', 'cat_men', 'Denim Trucker Jacket', 'denim-trucker-jacket', 'Classic vintage wash denim jacket with copper hardware.', NOW()),
('p_m_pant', 'cat_men', 'Slim Chino Pants', 'slim-chino-pants', 'Versatile chinos for work or weekend. Stretch fabric.', NOW());

INSERT INTO "ProductVariant" ("id", "productId", "name", "price", "stock", "updatedAt") VALUES
('v_m_tee_blk', 'p_m_tee', 'Black - L', 149000, 100, NOW()),
('v_m_tee_wht', 'p_m_tee', 'White - L', 149000, 100, NOW()),
('v_m_jacket_l', 'p_m_jacket', 'Vintage Blue - L', 599000, 20, NOW()),
('v_m_pant_32', 'p_m_pant', 'Khaki - 32', 399000, 50, NOW());

-- Women's Fashion
INSERT INTO "Product" ("id", "categoryId", "name", "slug", "description", "updatedAt") VALUES
('p_w_dress', 'cat_women', 'Summer Floral Dress', 'summer-floral-dress', 'Lightweight rayon dress with floral print. Perfect for summer.', NOW()),
('p_w_blouse', 'cat_women', 'Silk Blouse', 'silk-blouse', 'Elegant silk blouse suitable for office wear.', NOW());

INSERT INTO "ProductVariant" ("id", "productId", "name", "price", "stock", "updatedAt") VALUES
('v_w_dress_m', 'p_w_dress', 'Floral Red - M', 299000, 30, NOW()),
('v_w_blouse_s', 'p_w_blouse', 'Ivory - S', 450000, 25, NOW());

-- Electronics
INSERT INTO "Product" ("id", "categoryId", "name", "slug", "description", "updatedAt") VALUES
('p_tech_buds', 'cat_tech', 'Sonic Pro Earbuds', 'sonic-pro-earbuds', 'Active noise cancellation with 30h battery life.', NOW()),
('p_tech_watch', 'cat_tech', 'Smart Fitness Watch', 'smart-fitness-watch', 'Track your health metrics with precision. 7-day battery.', NOW()),
('p_tech_charger', 'cat_tech', 'Fast Gan Charger 65W', 'fast-gan-charger', 'Compact charger for laptops and phones.', NOW());

INSERT INTO "ProductVariant" ("id", "productId", "name", "price", "stock", "updatedAt") VALUES
('v_tech_buds_bk', 'p_tech_buds', 'Matte Black', 899000, 50, NOW()),
('v_tech_watch_sv', 'p_tech_watch', 'Silver Strap', 1299000, 30, NOW()),
('v_tech_charger', 'p_tech_charger', 'White', 299000, 100, NOW());

-- Accessories
INSERT INTO "Product" ("id", "categoryId", "name", "slug", "description", "updatedAt") VALUES
('p_acc_bag', 'cat_acc', 'Canvas Tote Bag', 'canvas-tote-bag', 'Durable canvas tote for daily essentials.', NOW()),
('p_acc_hat', 'cat_acc', 'Minimalist Cap', 'minimalist-cap', 'Cotton dad hat with embroidered logo.', NOW());

INSERT INTO "ProductVariant" ("id", "productId", "name", "price", "stock", "updatedAt") VALUES
('v_acc_bag_crm', 'p_acc_bag', 'Cream', 129000, 200, NOW()),
('v_acc_hat_nvy', 'p_acc_hat', 'Navy', 99000, 150, NOW());


-- 4. Users (5 unique users)
INSERT INTO "UserProfile" ("id", "supabaseUserId", "email", "fullName", "role", "updatedAt") VALUES
('u_admin', 'auth_admin_01', 'admin@zinc.com', 'Admin User', 'ADMIN', NOW()),
('u_alice', 'auth_alice_01', 'alice@gmail.com', 'Alice Pratama', 'USER', NOW()),
('u_budi', 'auth_budi_01', 'budi@yahoo.com', 'Budi Santoso', 'USER', NOW()),
('u_charlie', 'auth_charlie_01', 'charlie@outlook.com', 'Charlie Wijaya', 'USER', NOW()),
('u_diana', 'auth_diana_01', 'diana@gmail.com', 'Diana Kusuma', 'USER', NOW()),
('u_eko', 'auth_eko_01', 'eko@gmail.com', 'Eko Saputra', 'USER', NOW());

-- 5. Orders & Items (Mix of orders for history)

-- Alice's Orders
INSERT INTO "Order" ("id", "orderNumber", "userId", "status", "buyerName", "buyerPhone", "buyerAddress", "subtotal", "createdAt", "updatedAt") VALUES
('o_alice_1', 'ORD-001', 'u_alice', 'SUCCEEDED', 'Alice', '08111', 'Jakarta', 298000, NOW() - INTERVAL '30 days', NOW()),
('o_alice_2', 'ORD-002', 'u_alice', 'SUCCEEDED', 'Alice', '08111', 'Jakarta', 899000, NOW() - INTERVAL '15 days', NOW());

INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "variantName", "unitPrice", "quantity", "lineTotal") VALUES
('oi_a1_1', 'o_alice_1', 'p_m_tee', 'v_m_tee_blk', 'Essential Cotton Tee', 'Black - L', 149000, 2, 298000),
('oi_a2_1', 'o_alice_2', 'p_tech_buds', 'v_tech_buds_bk', 'Sonic Pro Earbuds', 'Matte Black', 899000, 1, 899000);

-- Budi's Orders
INSERT INTO "Order" ("id", "orderNumber", "userId", "status", "buyerName", "buyerPhone", "buyerAddress", "subtotal", "createdAt", "updatedAt") VALUES
('o_budi_1', 'ORD-003', 'u_budi', 'SUCCEEDED', 'Budi', '08222', 'Bandung', 599000, NOW() - INTERVAL '25 days', NOW()),
('o_budi_2', 'ORD-004', 'u_budi', 'SHIPPING', 'Budi', '08222', 'Bandung', 299000, NOW() - INTERVAL '2 days', NOW());

INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "variantName", "unitPrice", "quantity", "lineTotal") VALUES
('oi_b1_1', 'o_budi_1', 'p_m_jacket', 'v_m_jacket_l', 'Denim Trucker Jacket', 'Vintage Blue - L', 599000, 1, 599000),
('oi_b2_1', 'o_budi_2', 'p_tech_charger', 'v_tech_charger', 'Fast Gan Charger 65W', 'White', 299000, 1, 299000);

-- Charlie's Orders
INSERT INTO "Order" ("id", "orderNumber", "userId", "status", "buyerName", "buyerPhone", "buyerAddress", "subtotal", "createdAt", "updatedAt") VALUES
('o_charlie_1', 'ORD-005', 'u_charlie', 'SUCCEEDED', 'Charlie', '08333', 'Surabaya', 1299000, NOW() - INTERVAL '10 days', NOW());

INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "variantName", "unitPrice", "quantity", "lineTotal") VALUES
('oi_c1_1', 'o_charlie_1', 'p_tech_watch', 'v_tech_watch_sv', 'Smart Fitness Watch', 'Silver Strap', 1299000, 1, 1299000);

-- Diana's Orders
INSERT INTO "Order" ("id", "orderNumber", "userId", "status", "buyerName", "buyerPhone", "buyerAddress", "subtotal", "createdAt", "updatedAt") VALUES
('o_diana_1', 'ORD-006', 'u_diana', 'SUCCEEDED', 'Diana', '08444', 'Bali', 299000, NOW() - INTERVAL '5 days', NOW());

INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "variantName", "unitPrice", "quantity", "lineTotal") VALUES
('oi_d1_1', 'o_diana_1', 'p_w_dress', 'v_w_dress_m', 'Summer Floral Dress', 'Floral Red - M', 299000, 1, 299000);

-- Eko's Orders (Recent & Pending)
INSERT INTO "Order" ("id", "orderNumber", "userId", "status", "buyerName", "buyerPhone", "buyerAddress", "subtotal", "createdAt", "updatedAt") VALUES
('o_eko_1', 'ORD-007', 'u_eko', 'PENDING', 'Eko', '08555', 'Medan', 129000, NOW(), NOW());

INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "variantName", "unitPrice", "quantity", "lineTotal") VALUES
('oi_e1_1', 'o_eko_1', 'p_acc_bag', 'v_acc_bag_crm', 'Canvas Tote Bag', 'Cream', 129000, 1, 129000);


-- 6. Testimonials (Linked to Succeeded Orders)

-- Alice loves the Buds
INSERT INTO "Testimonial" ("id", "orderId", "userId", "rating", "message", "status", "source", "createdAt", "submittedAt", "approvedAt", "updatedAt") VALUES
('rev_01', 'o_alice_2', 'u_alice', 5, 'Suaranya jernih banget! Bass-nya nendang tapi nggak bikin pusing. Best purchase tahun ini.', 'APPROVED', 'MY_ORDERS', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW());

-- Budi likes the Jacket
INSERT INTO "Testimonial" ("id", "orderId", "userId", "rating", "message", "status", "source", "createdAt", "submittedAt", "approvedAt", "updatedAt") VALUES
('rev_02', 'o_budi_1', 'u_budi', 4, 'Bahan denimnya tebal dan kokoh. Ukurannya pas di badan. Cuma pengiriman agak lama dikit.', 'APPROVED', 'MAGIC_LINK', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW());

-- Charlie on the Watch
INSERT INTO "Testimonial" ("id", "orderId", "userId", "rating", "message", "status", "source", "createdAt", "submittedAt", "approvedAt", "updatedAt") VALUES
('rev_03', 'o_charlie_1', 'u_charlie', 5, 'Fitur trackingnya akurat. Baterai beneran tahan seminggu lebih. Desainnya juga premium.', 'APPROVED', 'POPUP', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW());

-- Diana on the Dress
INSERT INTO "Testimonial" ("id", "orderId", "userId", "rating", "message", "status", "source", "createdAt", "submittedAt", "approvedAt", "updatedAt") VALUES
('rev_04', 'o_diana_1', 'u_diana', 5, 'Cantik banget dressnya! Bahannya adem, cocok buat liburan di Bali. Thanks Zinc Store!', 'APPROVED', 'MY_ORDERS', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW());

-- A hidden/rejected review example (Alice on Tee)
INSERT INTO "Testimonial" ("id", "orderId", "userId", "rating", "message", "status", "source", "createdAt", "submittedAt", "approvedAt", "updatedAt") VALUES
('rev_05', 'o_alice_1', 'u_alice', 3, 'Kaosnya oke sih, tapi agak tipis menurutku. Pengiriman cepat.', 'HIDDEN', 'MY_ORDERS', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days', NULL, NOW());

