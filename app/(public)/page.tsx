import { Hero } from "@/components/features/home/hero";
import { getPopularProductsUseCase } from "@/server/usecases/product/get-popular-products.usecase";
import { ProductCard } from "@/components/features/product/product-card";
import { getStoreConfig } from "@/server/actions/store.actions";
import { getApprovedTestimonials } from "@/server/actions/testimonial.actions";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default async function LandingPage() {
  const config = await getStoreConfig();
  const popularProducts = await getPopularProductsUseCase(12);
  const testimonials = await getApprovedTestimonials(10);

  return (
    <div className="flex flex-col gap-16 pb-16">
      <div className="mx-auto max-w-7xl w-full">
        <Hero
          headline={config?.heroHeadline}
          subheadline={config?.heroSubheadline}
          ctaText={config?.heroCtaText}
          ctaHref={config?.heroCtaHref}
        />
      </div>

      <section className="w-full px-4 md:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Popular Products
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {popularProducts.map(({ variants, ...product }) => (
            <ProductCard key={product.id} {...product} hideBadge={true} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">
              Trusted by thousands of happy customers
            </p>
          </div>
        </div>

        {testimonials.length > 0 ? (
          <div>
            <InfiniteMovingCards
              items={testimonials.map((t) => ({
                id: t.id,
                name: t.user?.fullName || "Guest Customer",
                avatar: t.user?.avatarBase64,
                rating: t.rating,
                message: t.message,
                date: t.createdAt,
                productName: t.order?.items[0]?.product.name || "Product",
                productImage: t.order?.items[0]?.product.images[0]?.base64,
              }))}
              direction="right"
              speed="normal"
            />
          </div>
        ) : (
          <div className="mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8">
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed bg-background">
              <p className="text-muted-foreground">
                No testimonials yet. Be the first to share your experience!
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
