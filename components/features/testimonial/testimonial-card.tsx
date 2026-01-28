import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  rating: number;
  message: string;
  date: Date;
  className?: string;
}

export function TestimonialCard({
  name,
  rating,
  message,
  date,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm h-full flex flex-col",
        className,
      )}
    >
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4 transition-colors",
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted-foreground/20 text-muted-foreground/40 dark:fill-muted-foreground/30 dark:text-muted-foreground/50",
            )}
          />
        ))}
      </div>
      <p className="text-sm mb-4 leading-relaxed flex-1">{message}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <span className="font-medium">{name}</span>
        <span>
          {new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
