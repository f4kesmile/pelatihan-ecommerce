import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  avatar?: string | null;
  rating: number;
  message: string;
  date: Date;
  productName?: string;
  productImage?: string | null;
  className?: string;
}

export function TestimonialCard({
  name,
  avatar,
  rating,
  message,
  date,
  productName,
  productImage,
  className,
}: TestimonialCardProps) {
  // Helper to handle base64 prefixing
  const getSafeImageSrc = (src?: string | null) => {
    if (!src) return undefined;

    // Check for known valid URL formats
    if (src.startsWith("http") || src.startsWith("data:")) {
      return src;
    }

    // Check for static asset paths (if any exist in public folder)
    // Avoids treating Base64 JPEGs (starting with /9j/) as paths
    if (
      src.startsWith("/images/") ||
      src.startsWith("/icons/") ||
      src.startsWith("/assets/")
    ) {
      return src;
    }

    // Assume it's a Raw Base64 string
    return `data:image/jpeg;base64,${src}`;
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm h-full flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all",
        className,
      )}
    >
      {/* Decorative gradient background opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative space-y-4">
        {/* Header: User & Rating */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={getSafeImageSrc(avatar)} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-none">{name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating ? "fill-current" : "text-muted/20 fill-none",
              )}
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed text-muted-foreground italic relative z-10">
          &ldquo;{message}&rdquo;
        </p>
      </div>

      {/* Footer: Product Info (if available) */}
      {productName && (
        <div className="mt-6 pt-4 border-t flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-md bg-muted overflow-hidden border flex-shrink-0 relative">
            {getSafeImageSrc(productImage) ? (
              <Image
                src={getSafeImageSrc(productImage)!}
                alt={productName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                <Star className="h-4 w-4 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Purchased</p>
            <p className="text-xs font-medium truncate" title={productName}>
              {productName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
