import { getStoreConfig } from "@/server/actions/store.actions";
import { getProductsByIds } from "@/server/actions/product-select.actions";
import { getPopularProductsUseCase } from "@/server/usecases/product/get-popular-products.usecase";
import { Hero, HeroProduct } from "./hero";

export async function HeroSection() {
  const config = await getStoreConfig();
  let products: HeroProduct[] = [];

  if (config?.heroProductsMode === "MANUAL") {
    const configs =
      (config.heroProductConfigs as unknown as {
        productId: string;
        image?: string;
      }[]) || [];
    // Fallback to old IDs if configs are empty but IDs exist (migration safety)
    const ids =
      configs.length > 0
        ? configs.map((c) => c.productId)
        : config.heroProductIds || [];

    if (ids.length > 0) {
      const response = await getProductsByIds(ids);

      if (response.success && response.data) {
        interface ManualProduct {
          id: string;
          name: string;
          images: { base64: string | null; mimeType: string | null }[];
          variants: { price: number }[];
          slug: string;
        }

        const manualProducts = response.data as unknown as ManualProduct[];

        products = manualProducts
          .sort((a, b) => {
            // Sort by index in configs or ids
            const idxA =
              configs.length > 0
                ? configs.findIndex((c) => c.productId === a.id)
                : config.heroProductIds.indexOf(a.id);
            const idxB =
              configs.length > 0
                ? configs.findIndex((c) => c.productId === b.id)
                : config.heroProductIds.indexOf(b.id);
            return idxA - idxB;
          })
          .map((p) => {
            const configItem = configs.find((c) => c.productId === p.id);
            // Use selected image if available, else first image
            const selectedImage =
              configItem?.image ||
              (p.images[0]?.base64
                ? p.images[0].base64.startsWith("data:")
                  ? p.images[0].base64
                  : `data:${p.images[0].mimeType};base64,${p.images[0].base64}`
                : null);

            return {
              id: p.id,
              name: p.name,
              image: selectedImage,
              price: p.variants[0]?.price || 0,
              slug: p.slug,
            };
          });
      }
    }
  } else {
    const popular = await getPopularProductsUseCase(3);
    products = popular.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.minPrice,
      slug: p.slug,
    }));
  }

  return (
    <Hero
      headline={config?.heroHeadline}
      subheadline={config?.heroSubheadline}
      ctaText={config?.heroCtaText}
      ctaHref={config?.heroCtaHref}
      products={products}
    />
  );
}
