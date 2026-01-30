# 📂 STRUKTUR PROJECT LENGKAP (BIBLIA INSTRUKTUR)

Dokumen ini adalah **Kitab Suci Struktur Project**. Berisi pohon (tree) lengkap dan penjelasan mendalam untuk **setiap file** yang ada di dalam aplikasi.

**Catatan untuk Instruktur:**

- Gunakan fitur **Ctrl+F** untuk mencari nama file tertentu.
- Folder `node_modules/` dan `.next/` sengaja tidak dibahas karena isinya adalah library pihak ketiga yang tidak perlu dimodifikasi.
- Dokumen ini sengaja dibuat panjang agar tidak ada satu baris kode pun yang "misterius" bagi siswa.

---

# 📁 POHON STRUKTUR (TREE VIEW)

Berikut adalah gambaran lengkap folder dan file project ini:

```
ECOMMERCE/
│
├── 📁 .agent/                    # Folder konfigurasi AI Agent (tidak penting untuk siswa)
│
├── 📁 app/                       # 🔴 INTI ROUTING & HALAMAN (Next.js App Router)
│   │
│   ├── favicon.ico               # Icon kecil di tab browser
│   ├── globals.css               # Style CSS global (Tailwind base, warna tema)
│   ├── layout.tsx                # Layout paling luar (bungkus <html>, <body>)
│   │
│   ├── 📁 (dashboard)/           # GRUP AREA ADMIN (tidak muncul di URL)
│   │   │
│   │   ├── layout.tsx            # Layout khusus admin (Sidebar + Header)
│   │   │
│   │   └── 📁 dashboard/         # Halaman-halaman admin
│   │       ├── page.tsx                        # /dashboard (Halaman Ringkasan)
│   │       │
│   │       ├── 📁 products/
│   │       │   ├── page.tsx                    # /dashboard/products (List Produk)
│   │       │   ├── 📁 new/
│   │       │   │   └── page.tsx                # /dashboard/products/new (Tambah Produk)
│   │       │   └── 📁 [id]/
│   │       │       └── page.tsx                # /dashboard/products/123 (Edit Produk)
│   │       │
│   │       ├── 📁 orders/
│   │       │   ├── page.tsx                    # /dashboard/orders (List Order)
│   │       │   └── 📁 [id]/
│   │       │       └── page.tsx                # /dashboard/orders/456 (Detail Order)
│   │       │
│   │       ├── 📁 reviews/
│   │       │   └── page.tsx                    # /dashboard/reviews (Manajemen Testimoni)
│   │       │
│   │       ├── 📁 categories/
│   │       │   └── page.tsx                    # /dashboard/categories (Manajemen Kategori)
│   │       │
│   │       └── 📁 settings/
│   │           └── page.tsx                    # /dashboard/settings (Pengaturan Toko)
│   │
│   └── 📁 (public)/              # GRUP AREA PUBLIK (tidak muncul di URL)
│       │
│       ├── layout.tsx            # Layout khusus visitor (Navbar + Footer)
│       ├── page.tsx              # / (Halaman Beranda)
│       │
│       ├── 📁 products/
│       │   ├── page.tsx                        # /products (Katalog Produk)
│       │   └── 📁 [slug]/
│       │       └── page.tsx                    # /products/baju-keren (Detail Produk)
│       │
│       ├── 📁 cart/
│       │   └── page.tsx                        # /cart (Keranjang Belanja)
│       │
│       └── 📁 review/
│           └── 📁 [token]/
│               └── page.tsx                    # /review/abc123 (Form Review Customer)
│
├── 📁 components/                # 🟢 KOMPONEN UI (Potongan Tampilan)
│   │
│   ├── 📁 ui/                    # Komponen Atom (ShadcnUI)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── infinite-moving-cards.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── pagination.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   │
│   ├── 📁 shared/                # Komponen Umum (Dipakai banyak tempat)
│   │   ├── money.tsx
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── pagination-control.tsx
│   │   └── theme-toggle.tsx
│   │
│   └── 📁 features/              # Komponen Fitur Spesifik
│       │
│       ├── 📁 admin/
│       │   ├── app-sidebar.tsx
│       │   ├── dashboard-layout.tsx
│       │   ├── testimonials-list.tsx
│       │   └── ...
│       │
│       ├── 📁 product/
│       │   ├── product-card.tsx
│       │   ├── product-filters.tsx
│       │   ├── product-form.tsx
│       │   ├── product-images.tsx
│       │   └── ...
│       │
│       ├── 📁 home/
│       │   ├── hero.tsx
│       │   └── ...
│       │
│       ├── 📁 cart/
│       │   ├── cart-item.tsx
│       │   ├── cart-summary.tsx
│       │   └── ...
│       │
│       └── 📁 testimonial/
│           ├── review-popup.tsx
│           └── ...
│
├── 📁 lib/                       # 🔵 UTILITAS & KONEKSI
│   │
│   ├── 📁 db/
│   │   └── prisma.ts             # Singleton koneksi database
│   │
│   └── utils.ts                  # Helper functions (cn, formatCurrency)
│
├── 📁 server/                    # 🟣 BACKEND LOGIC (Server Actions)
│   │
│   ├── 📁 actions/               # Fungsi-fungsi yang dipanggil dari Frontend
│   │   ├── auth.actions.ts
│   │   ├── category.actions.ts
│   │   ├── dashboard.actions.ts
│   │   ├── order.actions.ts
│   │   ├── permission.actions.ts
│   │   ├── product.actions.ts
│   │   ├── review-settings.actions.ts
│   │   ├── store.actions.ts
│   │   ├── testimonial-admin.actions.ts
│   │   ├── testimonial.actions.ts
│   │   └── user.actions.ts
│   │
│   ├── 📁 repositories/          # Layer akses database
│   │   └── product.repository.ts
│   │
│   ├── 📁 schemas/               # Validasi data (Zod Schemas)
│   │   ├── checkout.schema.ts
│   │   ├── order.schema.ts
│   │   ├── product.schema.ts
│   │   ├── review-settings.schema.ts
│   │   ├── store.schema.ts
│   │   ├── testimonial.schema.ts
│   │   └── user.schema.ts
│   │
│   └── 📁 usecases/              # Business Logic Layer
│       └── 📁 product/
│           ├── get-popular-products.usecase.ts
│           ├── get-product-detail.usecase.ts
│           └── list-products.usecase.ts
│
├── 📁 prisma/                    # 🟠 DATABASE SCHEMA
│   │
│   ├── schema.prisma             # Definisi tabel database
│   ├── seed.ts                   # Script data dummy
│   ├── seed.sql                  # SQL alternatif
│   └── ...
│
├── 📁 public/                    # 🟤 ASET STATIS
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── 📁 types/                     # 🟡 TYPE DEFINITIONS
│   └── index.ts                  # TypeScript types/interfaces
│
├── 📁 utils/                     # 🟢 UTILITAS TAMBAHAN
│   └── 📁 supabase/
│       └── middleware.ts         # Auth middleware Supabase
│
├── .env                          # Environment Variables (RAHASIA!)
├── .gitignore                    # File yang diabaikan Git
├── next.config.mjs               # Konfigurasi Next.js
├── package.json                  # Daftar dependencies
├── tailwind.config.ts            # Konfigurasi Tailwind CSS
└── tsconfig.json                 # Konfigurasi TypeScript
```

---

# 📖 PENJELASAN LENGKAP PER FILE

Bagian ini menjelaskan **fungsi, isi, dan konteks** dari setiap file penting dalam project. Disusun berdasarkan urutan folder.

---

## 📁 FOLDER `app/` (Halaman & Routing)

Next.js 13+ menggunakan sistem **File-System Routing**. Artinya struktur folder di dalam `app/` otomatis menjadi URL website.

### 📄 `app/layout.tsx`

**Lokasi:** Folder root `app/`
**URL:** -
**Jenis:** Server Component

**Fungsi:**
File ini adalah **Root Layout**, pembungkus paling luar dari seluruh aplikasi. Semua halaman akan dirender di dalam komponen ini.

**Isi Kode (Penjelasan):**

```tsx
import { ThemeProvider } from "next-themes"; // Untuk Dark Mode
import { Toaster } from "@/components/ui/sonner"; // Notifikasi pop-up

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children} {/* Semua halaman masuk ke sini */}
          <Toaster /> {/* Pop-up notifikasi */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Kenapa Penting:**

- Di sinilah pengaturan global seperti Dark Mode dipasang.
- Jika ada bug pop-up notifikasi tidak muncul, cek apakah `<Toaster />` ada di sini.

---

### 📄 `app/globals.css`

**Lokasi:** Folder root `app/`

**Fungsi:**
File CSS global yang berlaku untuk seluruh halaman. Berisi:

1. Import Tailwind CSS (`@tailwind base; @tailwind components; @tailwind utilities;`)
2. Definisi variabel warna tema (`--primary`, `--background`, dll)
3. Style kustom yang tidak bisa dilakukan via class Tailwind

**Contoh Isi:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%; /* Warna latar mode terang */
  --foreground: 240 10% 3.9%; /* Warna teks mode terang */
  --primary: 142 76% 36%; /* Warna utama (Hijau) */
  /* ... dan seterusnya */
}

.dark {
  --background: 240 10% 3.9%; /* Warna latar mode gelap */
  /* ... */
}
```

**Materi Mengajar:**
Ajak siswa mengubah variabel warna `--primary` dan lihat efeknya di button.

---

### 📄 `app/(public)/page.tsx`

**Lokasi:** `app/(public)/page.tsx`
**URL:** `domain.com/` (Beranda)
**Jenis:** Server Component (Async)

**Fungsi:**
Ini adalah **Halaman Depan / Landing Page** website. Tugas utamanya:

1. Memanggil fungsi backend (`getPopularProductsUseCase`, `getApprovedTestimonials`)
2. Merender komponen Hero, Grid Produk Populer, dan Slider Testimoni

**Potongan Kode Penting:**

```tsx
export default async function LandingPage() {
  // PEMANGGILAN BACKEND (Server-Side)
  const popularProducts = await getPopularProductsUseCase(12);
  const testimonials = await getApprovedTestimonials(10);

  return (
    <div>
      <Hero />

      {/* Section Produk Populer */}
      <section>
        <h2>Popular Products</h2>
        <div className="grid ...">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} {...product} hideBadge={true} />
          ))}
        </div>
      </section>

      {/* Section Testimoni */}
      <section>
        <InfiniteMovingCards items={testimonials} />
      </section>
    </div>
  );
}
```

**Catatan:**

- Prop `hideBadge={true}` diberikan agar badge "POPULAR" tidak muncul di section ini (karena semua produk di sini sudah populer).
- Data di-fetch di server, bukan di client (SEO-friendly).

---

### 📄 `app/(public)/products/page.tsx`

**Lokasi:** `app/(public)/products/page.tsx`
**URL:** `domain.com/products`
**Jenis:** Server Component

**Fungsi:**
Halaman **Katalog Produk** dengan fitur:

- Pagination (Next/Prev page)
- Filter berdasarkan kategori
- Search berdasarkan nama

**Alur Data:**

1. Terima `searchParams` dari URL (`?page=2&category=fashion&q=baju`)
2. Panggil `listProductsUseCase()` dengan filter tersebut
3. Render grid `<ProductCard>` beserta komponen `<PaginationControl>`

---

### 📄 `app/(public)/products/[slug]/page.tsx`

**Lokasi:** `app/(public)/products/[slug]/page.tsx`
**URL:** `domain.com/products/kaos-polos-hitam`
**Jenis:** Server Component

**Apa itu `[slug]`?**
Kurung siku (`[]`) menandakan **Dynamic Route**. Nilai di dalam kurung siku akan diambil sebagai parameter. Contoh:

- URL: `/products/kaos-polos-hitam`
- `params.slug = "kaos-polos-hitam"`

**Fungsi:** Menampilkan detail satu produk spesifik (Galeri gambar, Deskripsi, Pilihan Varian, Tombol Add to Cart).

---

### 📄 `app/(dashboard)/layout.tsx`

**Lokasi:** `app/(dashboard)/layout.tsx`
**URL:** -
**Jenis:** Server Component

**Fungsi:**
Layout khusus untuk semua halaman admin (`/dashboard/*`). Berbeda dengan layout publik, layout ini mengandung:

1. Komponen `<DashboardLayout>` yang berisi Sidebar dan Header
2. Pengecekan autentikasi (Opsional: redirect jika bukan admin)

**Struktur:**

```tsx
import { DashboardLayout } from "@/components/features/admin/dashboard-layout";

export default function AdminLayout({ children }) {
  // Cek user login & role (opsional)
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

---

### 📄 `app/(dashboard)/dashboard/orders/[id]/page.tsx`

**Lokasi:** `app/(dashboard)/dashboard/orders/[id]/page.tsx`
**URL:** `domain.com/dashboard/orders/abc123`
**Jenis:** Server Component

**Fungsi:**
Menampilkan detail satu pesanan untuk Admin, meliputi:

- Informasi pembeli (Nama, No HP, Alamat)
- Daftar item yang dibeli
- Status pesanan saat ini
- Tombol **Update Status** dan **Request Testimonial**

**Parameter Dinamis:**

- `params.id` = ID pesanan dari database

---

## 📁 FOLDER `components/ui/` (Komponen Atom)

Folder ini berisi komponen dasar dari library **Shadcn UI**. Komponen ini sangat generik dan dipakai di banyak tempat.

### 📄 `button.tsx`

**Fungsi:** Komponen tombol dengan berbagai varian gaya.

**Varian yang Tersedia:**

- `default`: Tombol utama (background primary)
- `destructive`: Tombol bahaya (merah, untuk delete)
- `outline`: Hanya border, transparan
- `secondary`: Warna sekunder
- `ghost`: Tanpa background, hanya hover effect
- `link`: Terlihat seperti link

**Cara Pakai:**

```tsx
<Button variant="destructive">Hapus Produk</Button>
<Button variant="ghost" size="icon"><TrashIcon /></Button>
```

---

### 📄 `dialog.tsx`

**Fungsi:** Pop-up modal yang muncul di tengah layar dengan overlay gelap di belakangnya.

**Struktur Penggunaan:**

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Buka Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Judul Modal</DialogTitle>
      <DialogDescription>Deskripsi tambahan</DialogDescription>
    </DialogHeader>
    {/* Konten Modal */}
    <DialogFooter>
      <Button>Simpan</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 📄 `sheet.tsx`

**Fungsi:** Drawer/Panel yang muncul dari samping layar (kiri/kanan/atas/bawah).

**Kapan Dipakai:**

- Mobile Menu (Sidebar muncul dari kiri)
- Filter Panel di mobile
- Cart Preview

**Perbedaan dengan Dialog:**

- Dialog = Muncul di tengah
- Sheet = Muncul dari samping

---

### 📄 `dropdown-menu.tsx`

**Fungsi:** Menu yang muncul saat trigger diklik (seperti menu klik kanan).

**Contoh Penggunaan:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      <MoreVertical />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem className="text-red-500">Hapus</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Catatan Penting:**
Di dalam file ini ada class `z-[200]` yang memastikan dropdown muncul di atas elemen lain (termasuk sidebar mobile `z-[100]`).

---

### 📄 `sidebar.tsx`

**Fungsi:** Komponen sidebar yang responsif.

**Perilaku Otomatis:**

- **Desktop (>768px):** Sidebar dirender sebagai `<aside>` statis di samping kiri.
- **Mobile (<768px):** Sidebar dirender sebagai `<Sheet>` (Drawer) yang perlu di-trigger.

**Hook Penting:**

- `useSidebar()`: Mengakses state sidebar (open/close, mobile/desktop)
- `setOpenMobile(false)`: Menutup sidebar di mobile

---

### 📄 `form.tsx`

**Fungsi:** Wrapper untuk **React Hook Form** yang terintegrasi dengan komponen Shadcn.

**Komponen yang Disediakan:**

- `<Form>`: Provider konteks form
- `<FormField>`: Menghubungkan input dengan control
- `<FormItem>`: Wrapper item form
- `<FormLabel>`: Label input
- `<FormControl>`: Wrapper untuk input sebenarnya
- `<FormMessage>`: Menampilkan pesan error validasi
- `<FormDescription>`: Teks bantuan

---

## 📁 FOLDER `components/features/` (Komponen Fitur)

### 📄 `admin/app-sidebar.tsx`

**Lokasi:** `components/features/admin/app-sidebar.tsx`

**Fungsi:**
Sidebar navigasi untuk area admin. Berisi:

1. Logo/Nama Toko (di header)
2. Daftar menu navigasi (Dashboard, Products, Orders, dll)
3. Profil User di footer (dengan dropdown logout)

**Fitur Kunci:**

- **Auto-Close Mobile:** Saat menu diklik di HP, sidebar otomatis tertutup.
  ```tsx
  onClick={() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }}
  ```

---

### 📄 `admin/testimonials-list.tsx`

**Lokasi:** `components/features/admin/testimonials-list.tsx`

**Fungsi:**
Tabel manajemen testimoni untuk Admin dengan fitur:

- **Expandable Rows:** Klik baris untuk melihat detail order terkait
- **Status Badge:** Menampilkan status PENDING/APPROVED/REJECTED
- **Action Buttons:** Approve, Reject, Delete

---

### 📄 `product/product-card.tsx`

**Lokasi:** `components/features/product/product-card.tsx`

**Fungsi:**
Kartu produk yang ditampilkan di katalog dan homepage.

**Props:**
| Prop | Tipe | Fungsi |
|------|------|--------|
| `name` | string | Nama produk |
| `slug` | string | URL-friendly name |
| `categoryName` | string | Nama kategori |
| `minPrice` | number | Harga terendah dari varian |
| `image` | string/null | URL gambar (Base64) |
| `isPopular` | boolean | Apakah produk populer |
| `hideBadge` | boolean | Sembunyikan badge walaupun populer |

**Logika Badge:**

```tsx
{
  isPopular && !hideBadge && <span className="badge">⭐ POPULAR</span>;
}
```

---

## 📁 FOLDER `server/` (Backend Logic)

### 📄 `actions/product.actions.ts`

**Lokasi:** `server/actions/product.actions.ts`

**Fungsi:**
Server Actions untuk operasi CRUD produk.

**Fungsi-fungsi:**

1. `createProduct(data)`: Membuat produk baru beserta varian dan gambar
2. `updateProduct(id, data)`: Mengupdate produk existing
3. `deleteProduct(id)`: Menghapus produk

**Transaksi Database:**
Operasi create/update menggunakan `prisma.$transaction` untuk memastikan atomisitas (semua berhasil atau semua gagal).

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Simpan produk
  const product = await tx.product.create({ data: {...} });

  // 2. Simpan gambar
  await tx.productImage.createMany({ data: [...] });

  // 3. Simpan varian
  await tx.productVariant.createMany({ data: [...] });
});
```

---

### 📄 `actions/order.actions.ts`

**Lokasi:** `server/actions/order.actions.ts`

**Fungsi:**
Menangani proses checkout dan update status order.

**Algoritma `createOrder`:**

1. Validasi stok varian
2. Kurangi stok di database
3. Hitung total harga
4. Simpan Order dan OrderItem
5. Return Order ID

**Algoritma `updateOrderStatus`:**

1. Ambil order lama
2. Jika status baru = CANCELLED, kembalikan stok
3. Update status order

---

### 📄 `repositories/product.repository.ts`

**Lokasi:** `server/repositories/product.repository.ts`

**Fungsi:**
Layer khusus untuk query database yang kompleks. Memisahkan logika query dari action.

**Fungsi Penting:**

1. `findAll({ page, limit, filters })`: Query list produk dengan pagination & filter
2. `findPopular(limit)`: Query produk populer dengan hybrid logic
3. `findBySlug(slug)`: Query satu produk berdasarkan slug

**Logika `findPopular()` (Detail):**

```typescript
return prisma.product.findMany({
  where: {
    isActive: true,
    OR: [
      { isPopular: true }, // Manual admin pick
      { orderItems: { some: {} } }, // Punya riwayat terjual
    ],
  },
  orderBy: [
    { isPopular: "desc" }, // Admin picks first
    { orderItems: { _count: "desc" } }, // Best sellers second
    { createdAt: "desc" }, // Newest third
  ],
  include: {
    _count: { select: { orderItems: true } },
  },
});
```

---

### 📄 `usecases/product/list-products.usecase.ts`

**Lokasi:** `server/usecases/product/list-products.usecase.ts`

**Fungsi:**
Layer penengah antara Action/Page dan Repository. Tugas utamanya:

1. Menerima parameter dari halaman
2. Memanggil repository
3. Memformat data agar siap tampil di UI

**Contoh Formatting:**

```typescript
const mappedProducts = products.map((p) => {
  const minPrice = p.variants?.[0]?.price || 0;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryName: p.category.name,
    image: p.images[0]?.base64
      ? `data:${p.images[0].mimeType};base64,${p.images[0].base64}`
      : null,
    minPrice,
    isPopular: p.isPopular || (p._count?.orderItems ?? 0) > 0,
  };
});
```

---

### 📄 `schemas/product.schema.ts`

**Lokasi:** `server/schemas/product.schema.ts`

**Fungsi:**
Validasi data produk menggunakan library **Zod**.

**Contoh Skema:**

```typescript
export const productFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  images: z.array(imageSchema).optional(),
  variants: z.array(variantSchema).min(1, "Minimal 1 varian"),
});
```

---

## 📁 FOLDER `lib/` (Utilities)

### 📄 `db/prisma.ts`

**Lokasi:** `lib/db/prisma.ts`

**Fungsi:**
Singleton instance untuk koneksi Prisma ke database.

**Kenapa Singleton?**
Tanpa singleton, setiap kali file di-import, koneksi baru dibuat. Ini bisa menyebabkan error "Too many connections" saat development (karena hot-reload).

**Kode:**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

---

### 📄 `utils.ts`

**Lokasi:** `lib/utils.ts`

**Fungsi:**
Kumpulan fungsi helper yang sering dipakai.

**Fungsi Utama:**

1. `cn(...classes)`: Menggabungkan class Tailwind dengan kondisional

   ```typescript
   cn("px-4 py-2", isActive && "bg-primary", className);
   ```

2. `formatCurrency(amount)`: Format angka ke mata uang Rupiah
   ```typescript
   formatCurrency(50000); // "Rp 50.000"
   ```

---

## 📁 FOLDER `prisma/` (Database)

### 📄 `schema.prisma`

**Lokasi:** `prisma/schema.prisma`

**Fungsi:**
Definisi skema database menggunakan Prisma DSL.

**Model Utama:**

**1. Model `Product`**

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  isActive    Boolean  @default(true)
  isPopular   Boolean  @default(false)

  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])

  images      ProductImage[]
  variants    ProductVariant[]
  orderItems  OrderItem[]
}
```

**2. Model `ProductVariant`**

```prisma
model ProductVariant {
  id        String  @id @default(cuid())
  name      String
  sku       String?
  price     Int
  stock     Int     @default(0)
  isActive  Boolean @default(true)

  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

**3. Model `Order`**

```prisma
model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique
  status      OrderStatus @default(PENDING)

  buyerName   String
  buyerPhone  String
  buyerAddress String

  totalAmount Int

  items       OrderItem[]
  testimonial Testimonial?
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  COMPLETED
  CANCELLED
}
```

---

### 📄 `seed.ts`

**Lokasi:** `prisma/seed.ts`

**Fungsi:**
Script untuk mengisi database awal dengan data dummy/contoh.

**Cara Menjalankan:**

```bash
npx prisma db seed
```

---

## 📁 FOLDER `types/` (Type Definitions)

### 📄 `index.ts`

**Lokasi:** `types/index.ts`

**Fungsi:**
Menyimpan TypeScript interfaces/types yang digunakan di banyak tempat.

**Contoh:**

```typescript
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "CUSTOMER";
  avatarBase64?: string;
}

export interface CartItem {
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  image?: string;
}
```

---

# 🎓 TIPS UNTUK INSTRUKTUR

1. **Latihan Struktur:**
   Minta siswa membuat halaman baru `/about` dengan menambah file `app/(public)/about/page.tsx`

2. **Latihan Komponen:**
   Minta siswa membuat komponen `DiscountBadge` di `components/ui/` dan gunakannya di `ProductCard`

3. **Latihan Backend:**
   Minta siswa menambahkan field baru `weight` di model `ProductVariant` dan pastikan bisa diinput dari form

4. **Latihan Query:**
   Minta siswa mengubah logic "Popular" dari `> 0` menjadi `>= 5` di `product.repository.ts`

---

**Dokumen ini berisi ~1200 baris.** Gunakan sebagai referensi lengkap saat mengajar!
