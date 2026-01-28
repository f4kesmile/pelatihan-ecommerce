import prisma from "@/lib/db/prisma";
import { ProductsList } from "@/components/features/admin/products-list";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize to avoid Date object warnings
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return <ProductsList products={serializedProducts} />;
}
