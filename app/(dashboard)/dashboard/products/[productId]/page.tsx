import { ProductForm } from "@/components/features/admin/product-form";
import prisma from "@/lib/db/prisma";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;

  const categories = await prisma.category.findMany();

  // New Product
  if (resolvedParams.productId === "new") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
        </div>
        <ProductForm categories={categories} />
      </div>
    );
  }

  // Edit Product
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.productId },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { price: "asc" } },
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  // Transform to match schema shape
  const initialData = {
    ...product,
    categoryId: product.categoryId,
    description: product.description || undefined,
    images: product.images.map((img) => ({
      id: img.id, // Only present in edit
      base64: img.base64,
      mimeType: img.mimeType,
      size: img.size,
      name: img.name,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      // Ensure explicit null/undefined handling to match schema optional
      sku: v.sku ?? undefined,
      price: v.price,
      stock: v.stock,
      isActive: v.isActive,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
