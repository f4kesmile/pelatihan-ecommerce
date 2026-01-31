import { ProductForm } from "@/components/features/admin/products/product-form";
import prisma from "@/lib/db/prisma";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;

  const categories = await prisma.category.findMany();

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

  const initialData = {
    ...product,
    categoryId: product.categoryId,
    isActive: product.isActive,
    isPopular: product.isPopular,
    description: product.description || undefined,
    images: product.images.map((img) => ({
      id: img.id,
      base64: img.base64,
      mimeType: img.mimeType,
      size: img.size,
      name: img.name,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
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
