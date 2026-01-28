import Link from "next/link";
import { Money } from "@/components/shared/money";

interface ProductCardProps {
  name: string;
  slug: string;
  categoryName: string;
  minPrice: number;
  image: string | null;
}

export function ProductCard({
  name,
  slug,
  categoryName,
  minPrice,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div className="aspect-square w-full overflow-hidden bg-muted relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
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
          <h3 className="font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="mt-auto pt-2">
            <p className="text-xs text-muted-foreground mb-1">Mulai dari</p>
            <Money
              amount={minPrice}
              className="text-lg font-bold text-primary"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
