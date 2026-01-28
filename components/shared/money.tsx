import { cn } from "@/lib/utils";

interface MoneyProps {
  amount: number;
  currency?: string;
  locale?: string;
  className?: string;
}

export function Money({
  amount,
  currency = "IDR",
  locale = "id-ID",
  className,
}: MoneyProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return <span className={cn("font-medium", className)}>{formatted}</span>;
}
