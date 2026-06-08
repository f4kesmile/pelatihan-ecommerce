import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  Product,
  ProductStatus,
  SortState,
} from "@/types";

export const LOW_STOCK_THRESHOLD = 5;

export function getProductStatus(product: Product): ProductStatus {
  if (!product.isActive) {
    return "empty";
  }

  const activeVariants = product.variants.filter((v) => v.isActive);

  if (activeVariants.length === 0) {
    return "empty";
  }

  const allOutOfStock = activeVariants.every((v) => v.stock === 0);
  if (allOutOfStock) {
    return "empty";
  }

  const hasLowStock = activeVariants.some(
    (v) => v.stock > 0 && v.stock <= LOW_STOCK_THRESHOLD,
  );
  if (hasLowStock) {
    return "low";
  }

  return "ready";
}

export const STATUS_CONFIG: Record<
  ProductStatus,
  {
    label: string;
    className: string;
    icon: LucideIcon;
    sortOrder: number;
  }
> = {
  ready: {
    label: "Ready",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    icon: CheckCircle2,
    sortOrder: 0,
  },
  low: {
    label: "Low",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
    sortOrder: 1,
  },
  empty: {
    label: "Empty",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: XCircle,
    sortOrder: 2,
  },
};

export function sortProducts(
  products: Product[],
  sort: SortState | null,
): Product[] {
  if (!sort) return products;

  const sorted = [...products];
  const dir = sort.direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sort.key) {
      case "name":
        return a.name.localeCompare(b.name) * dir;

      case "status": {
        const statusA = STATUS_CONFIG[getProductStatus(a)].sortOrder;
        const statusB = STATUS_CONFIG[getProductStatus(b)].sortOrder;
        return (statusA - statusB) * dir;
      }

      case "category":
        return a.category.name.localeCompare(b.category.name) * dir;

      case "popular": {
        const popA = a.isPopular ? 1 : 0;
        const popB = b.isPopular ? 1 : 0;
        const orderA = a._count?.orderItems ?? 0;
        const orderB = b._count?.orderItems ?? 0;
        const scoreA = popA * 10000 + orderA;
        const scoreB = popB * 10000 + orderB;
        return (scoreB - scoreA) * dir;
      }

      case "stock": {
        const stockA = a.variants.reduce((s, v) => s + v.stock, 0);
        const stockB = b.variants.reduce((s, v) => s + v.stock, 0);
        return (stockA - stockB) * dir;
      }

      case "price": {
        const pricesA = a.variants.map((v) => v.price);
        const pricesB = b.variants.map((v) => v.price);
        const minA = pricesA.length > 0 ? Math.min(...pricesA) : 0;
        const minB = pricesB.length > 0 ? Math.min(...pricesB) : 0;
        return (minA - minB) * dir;
      }

      default:
        return 0;
    }
  });

  return sorted;
}
