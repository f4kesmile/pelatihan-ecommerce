"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Package,
  Pencil,
  Eye,
  Star,
  Flame,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Money } from "@/components/shared/money";
import { cn } from "@/lib/utils";

import { Product, SortKey, SortState } from "@/types";
import {
  getProductStatus,
  sortProducts,
  LOW_STOCK_THRESHOLD,
} from "@/components/features/admin/products/product-utils";
import { StatusBadge } from "@/components/features/admin/products/product-status-badge";

interface ProductsListProps {
  products: Product[];
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortState | null;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = currentSort?.key === sortKey;

  return (
    <TableHead className={className}>
      <button
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors -ml-2 px-2 py-1 rounded-md hover:bg-muted"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {isActive ? (
          currentSort.direction === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}

export function ProductsList({ products }: ProductsListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState | null>(null);

  const toggleRow = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Products
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-5 w-5" /> Create Product
          </Link>
        </Button>
      </div>

      <div className="block lg:hidden space-y-4">
        {sortedProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No products yet.</p>
              <Button asChild>
                <Link href="/dashboard/products/new">
                  Create your first product
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedProducts.map((product) => {
            const mainImage = product.images[0];
            const prices = product.variants.map((v) => v.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
            const totalStock = product.variants.reduce(
              (acc, v) => acc + v.stock,
              0,
            );
            const isExpanded = expandedRows.has(product.id);
            const status = getProductStatus(product);

            return (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="flex gap-4 p-4 cursor-pointer"
                    onClick={() => toggleRow(product.id)}
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {mainImage ? (
                        <Image
                          src={`data:${mainImage.mimeType};base64,${mainImage.base64}`}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        </div>
                        <StatusBadge status={status} />
                      </div>

                      {product.isPopular && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-600 border-amber-500/20">
                            <Star className="h-3 w-3 fill-amber-600" /> Popular
                            (Admin)
                          </span>
                        </div>
                      )}

                      {product._count?.orderItems > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium bg-orange-500/10 text-orange-600 border-orange-500/20">
                            <Flame className="h-3 w-3 fill-orange-600" /> Best
                            Seller ({product._count.orderItems} sold)
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          {minPrice === maxPrice ? (
                            <Money amount={minPrice} />
                          ) : (
                            <>
                              <Money amount={minPrice} /> -{" "}
                              <Money amount={maxPrice} />
                            </>
                          )}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stock: </span>
                          <span className="font-medium">{totalStock}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <button
                          className="flex items-center gap-1 text-sm text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(product.id);
                          }}
                          aria-label={
                            isExpanded ? "Collapse variants" : "Expand variants"
                          }
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Hide variants
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-4 w-4" />
                              {product.variants.length} variant
                              {product.variants.length > 1 ? "s" : ""}
                            </>
                          )}
                        </button>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/dashboard/products/${product.id}`}
                              aria-label={`Edit ${product.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              aria-label={`View ${product.name} on public site`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-muted/30 p-4 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Variants
                      </div>
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm",
                            !variant.isActive && "opacity-50",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{variant.name}</span>
                            {!variant.isActive && (
                              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                Off
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <Money amount={variant.price} />
                            </div>
                            <div
                              className={cn(
                                "min-w-[40px]",
                                variant.stock === 0 && "text-destructive",
                              )}
                            >
                              {variant.stock} pcs
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Desktop Grid Layout - Hybrid Table/Card Look */}
      <div className="hidden lg:block space-y-0 border rounded-md overflow-hidden bg-card">
        {/* Header - Styled like TableHeader */}
        <div className="bg-muted/40 px-6 py-3 font-medium text-sm text-muted-foreground grid grid-cols-[50px_80px_3fr_100px_140px_100px_120px_80px_50px] gap-4 items-center border-b">
          <div />
          <div>Image</div>
          <div
            className="cursor-pointer hover:text-foreground flex items-center gap-1"
            onClick={() => handleSort("name")}
          >
            Name
            {sort?.key === "name" &&
              (sort.direction === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              ))}
          </div>
          <div
            className="cursor-pointer hover:text-foreground flex items-center gap-1"
            onClick={() => handleSort("status")}
          >
            Status
            {sort?.key === "status" &&
              (sort.direction === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              ))}
          </div>
          <div
            className="cursor-pointer hover:text-foreground flex items-center gap-1"
            onClick={() => handleSort("price")}
          >
            Price Range
            {sort?.key === "price" &&
              (sort.direction === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              ))}
          </div>
          <div
            className="cursor-pointer hover:text-foreground flex items-center gap-1"
            onClick={() => handleSort("stock")}
          >
            Total Stock
            {sort?.key === "stock" &&
              (sort.direction === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              ))}
          </div>
          <div
            className="cursor-pointer hover:text-foreground flex items-center gap-1"
            onClick={() => handleSort("category")}
          >
            Category
            {sort?.key === "category" &&
              (sort.direction === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              ))}
          </div>
          <div
            className="text-center cursor-pointer hover:text-foreground flex items-center justify-center gap-1"
            onClick={() => handleSort("popular")}
          >
            Popular
            {sort?.key === "popular" &&
              (sort.direction === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              ))}
          </div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows - Styled like TableRows */}
        <div className="divide-y">
          {sortedProducts.map((product) => {
            const mainImage = product.images[0];
            const prices = product.variants.map((v) => v.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
            const totalStock = product.variants.reduce(
              (acc, v) => acc + v.stock,
              0,
            );
            const isExpanded = expandedRows.has(product.id);
            const status = getProductStatus(product);

            return (
              <div
                key={product.id}
                className={cn(
                  "group transition-all",
                  isExpanded ? "bg-muted/30" : "hover:bg-muted/50",
                )}
              >
                {/* Product Main Row - Flat Table Look */}
                <div
                  onClick={() => toggleRow(product.id)}
                  className="px-6 py-4 grid grid-cols-[50px_80px_3fr_100px_140px_100px_120px_80px_50px] gap-4 items-center cursor-pointer"
                >
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(product.id);
                      }}
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <div>
                    <div className="relative aspect-square h-14 w-14 rounded-lg overflow-hidden bg-muted ring-1 ring-border">
                      {mainImage ? (
                        <Image
                          src={`data:${mainImage.mimeType};base64,${mainImage.base64}`}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-medium text-base">
                    {product.name}
                    <div className="text-sm text-muted-foreground">
                      {product.variants.length} variant
                      {product.variants.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={status} />
                  </div>
                  <div className="text-sm">
                    {minPrice === maxPrice ? (
                      <Money amount={minPrice} />
                    ) : (
                      <>
                        <Money amount={minPrice} /> -{" "}
                        <Money amount={maxPrice} />
                      </>
                    )}
                  </div>
                  <div className="text-sm font-medium">{totalStock}</div>
                  <div className="text-sm">{product.category.name}</div>
                  <div className="flex items-center justify-center gap-1">
                    {product.isPopular && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                    {product._count?.orderItems > 0 && (
                      <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" className="h-9 w-9 p-0">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/${product.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            target="_blank"
                            href={`/products/${product.slug}`}
                          >
                            View Public
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Variants Expansion - Explicit Card Styling */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 space-y-3">
                    {/* Decorative connector */}
                    <div className="ml-[24px] h-4 border-l-2 border-dashed border-border/50" />

                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={cn(
                          "relative grid grid-cols-[50px_80px_3fr_100px_140px_100px_120px_80px_50px] gap-4 items-center bg-background border rounded-lg py-3 shadow-sm hover:shadow-md transition-all",
                          !variant.isActive &&
                            "opacity-60 bg-muted/10 grayscale",
                        )}
                      >
                        {/* Card Connector Line */}
                        <div className="absolute -left-[26px] top-1/2 w-[26px] h-px border-t-2 border-dashed border-border/50" />
                        <div className="absolute -left-[26px] -top-[50px] bottom-1/2 w-0 border-l-2 border-dashed border-border/50" />

                        {/* Checkbox Placeholder */}
                        <div className="flex justify-center">
                          {/* Dot / Icon could go here */}
                        </div>

                        {/* Image Placeholder */}
                        <div />

                        {/* Name (Aligned) */}
                        <div className="flex items-center gap-2 -ml-4">
                          <span className="font-medium text-sm">
                            {variant.name}
                          </span>
                          {!variant.isActive && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border font-medium">
                              Off
                            </span>
                          )}
                        </div>

                        {/* Status (Empty) */}
                        <div />

                        {/* Price (Aligned) */}
                        <div className="text-sm font-medium text-muted-foreground">
                          <Money amount={variant.price} />
                        </div>

                        {/* Stock (Aligned) */}
                        <div
                          className={cn(
                            "text-sm font-medium",
                            variant.stock === 0
                              ? "text-destructive"
                              : variant.stock <= LOW_STOCK_THRESHOLD
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground",
                          )}
                        >
                          {variant.stock}
                        </div>

                        {/* Empty Columns */}
                        <div className="col-span-3" />
                      </div>
                    ))}
                    <div className="h-2" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
