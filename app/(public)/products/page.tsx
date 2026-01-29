import { ProductFilters } from "@/components/features/product/product-filters";
import { ProductCard } from "@/components/features/product/product-card";
import { PaginationControl } from "@/components/shared/pagination-control";
import { listProductsUseCase } from "@/server/usecases/product/list-products.usecase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products | Zinc Store",
  description: "Browse our extensive collection of premium products.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const search = resolvedParams.q || "";
  const categorySlug = resolvedParams.category || "";

  const { data: products, meta } = await listProductsUseCase({
    page,
    limit: 12,
    search,
    categorySlug,
  });

  return (
    <div className="w-full">
      <div className="px-4 md:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-1">
              Browse our collection of {meta.total} products
            </p>
          </div>
          <ProductFilters />
        </div>

        {products.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center rounded-lg border border-dashed text-center animate-in fade-in-50">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              We couldn&apos;t find any products matching your criteria. Try
              adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <PaginationControl
            currentPage={meta.page}
            totalPages={meta.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
