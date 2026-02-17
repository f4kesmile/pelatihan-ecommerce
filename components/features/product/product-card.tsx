"use client";

import Link from "next/link";
import Image from "next/image";
import { Money } from "@/components/shared/money";
import { Button } from "@/components/ui/button";
import { ProductBuyDrawer } from "./product-buy-drawer";
import { ShoppingBag, Star } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  minPrice: number;
  image: string | null;
  isPopular?: boolean;
  hideBadge?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
  variants?: Variant[];
}

export function ProductCard({
  id,
  name,
  slug,
  categoryName,
  minPrice,
  image,
  isPopular,
  hideBadge,
  headingLevel,
  variants = [],
}: ProductCardProps) {
  const Heading = (headingLevel || "h3") as React.ElementType;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md relative">
      {isPopular && !hideBadge && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-[2px]">
            <Star className="h-3 w-3 fill-white" /> POPULAR
          </span>
        </div>
      )}

      <Link href={`/products/${slug}`} className="group block flex-1">
        <div className="aspect-square w-full overflow-hidden bg-muted relative">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground/50">
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 text-xs text-muted-foreground uppercase tracking-wider">
            {categoryName}
          </div>
          <Heading className="font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </Heading>
          <div className="mt-auto pt-2">
            <p className="text-xs text-muted-foreground mb-1">Mulai dari</p>
            <div className="flex items-center justify-between">
              <Money
                amount={minPrice}
                className="text-lg font-bold text-primary"
              />
              {variants.length > 0 && (
                <div
                  className="md:hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ProductBuyDrawer
                    product={{ id, name, slug, image, variants }}
                  >
                    <Button size="sm" className="h-7 text-xs px-2.5">
                      <ShoppingBag className="mr-1 h-3 w-3" />
                      Beli
                    </Button>
                  </ProductBuyDrawer>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
