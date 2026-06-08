import { getProductDetailUseCase } from "@/server/usecases/product/get-product-detail.usecase";
import { ProductDetail } from "@/components/features/product/product-detail";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductDetailUseCase(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Zinc Store`,
    description:
      product.description?.slice(0, 160) || `Buy ${product.name} at Zinc Store`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getProductDetailUseCase(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="container px-4 md:px-6 lg:px-8 py-8">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
