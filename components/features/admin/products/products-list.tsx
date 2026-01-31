"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
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
import { Money } from "@/components/shared/money";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  base64: string;
  mimeType: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isPopular: boolean;
  category: { name: string };
  variants: Variant[];
  images: ProductImage[];
  _count: {
    orderItems: number;
  };
}

interface ProductsListProps {
  products: Product[];
}

function StatusBadge({
  soldOut,
  isActive,
}: {
  soldOut: boolean;
  isActive: boolean;
}) {
  if (soldOut) {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive/15 text-destructive border-destructive/20">
        Sold Out
      </span>
    );
  }
  if (isActive) {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
      Draft
    </span>
  );
}

export function ProductsList({ products }: ProductsListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const isSoldOut = (variants: Variant[]) => {
    const hasActiveStock = variants.some((v) => v.isActive && v.stock > 0);
    return !hasActiveStock;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-4">
        {products.length === 0 ? (
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
          products.map((product) => {
            const mainImage = product.images[0];
            const prices = product.variants.map((v) => v.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
            const totalStock = product.variants.reduce(
              (acc, v) => acc + v.stock,
              0,
            );
            const isExpanded = expandedRows.has(product.id);
            const soldOut = isSoldOut(product.variants);

            return (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Product Info */}
                  <div
                    className="flex gap-4 p-4 cursor-pointer"
                    onClick={() => toggleRow(product.id)}
                  >
                    {/* Image */}
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

                    {/* Details */}
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
                        <StatusBadge
                          soldOut={soldOut}
                          isActive={product.isActive}
                        />
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

                  {/* Expanded Variants */}
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

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const mainImage = product.images[0];
              const prices = product.variants.map((v) => v.price);
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
              const totalStock = product.variants.reduce(
                (acc, v) => acc + v.stock,
                0,
              );
              const isExpanded = expandedRows.has(product.id);
              const soldOut = isSoldOut(product.variants);

              return (
                <React.Fragment key={product.id}>
                  {/* Main Product Row */}
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleRow(product.id)}
                  >
                    <TableCell>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(product.id);
                        }}
                        className="p-1"
                        aria-label={
                          isExpanded ? "Collapse variants" : "Expand variants"
                        }
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="relative aspect-square h-14 w-14 rounded-lg overflow-hidden bg-muted">
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
                    </TableCell>
                    <TableCell className="font-medium text-base">
                      {product.name}
                      {product.isPopular && (
                        <span
                          className="ml-2 inline-flex items-center"
                          title="Manually set as Popular"
                        >
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </span>
                      )}
                      {product._count?.orderItems > 0 && (
                        <span
                          className="ml-2 inline-flex items-center"
                          title={`Best Seller (${product._count.orderItems} sold)`}
                        >
                          <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                        </span>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {product.variants.length} variant
                        {product.variants.length > 1 ? "s" : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        soldOut={soldOut}
                        isActive={product.isActive}
                      />
                    </TableCell>
                    <TableCell className="text-base">
                      {minPrice === maxPrice ? (
                        <Money amount={minPrice} />
                      ) : (
                        <>
                          <Money amount={minPrice} /> -{" "}
                          <Money amount={maxPrice} />
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-base font-medium">
                      {totalStock}
                    </TableCell>
                    <TableCell className="text-base">
                      {product.category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" className="h-9 w-9 p-0">
                            <span className="sr-only">Open menu</span>
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
                    </TableCell>
                  </TableRow>

                  {/* Expanded Variants Row */}
                  {isExpanded && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={8} className="p-0">
                        <div className="px-16 py-4">
                          <div className="text-sm font-medium text-muted-foreground mb-3">
                            Variant Details
                          </div>
                          <div className="grid gap-2">
                            {product.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className={cn(
                                  "flex items-center justify-between rounded-lg border bg-background px-4 py-3",
                                  !variant.isActive && "opacity-50",
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">
                                    {variant.name}
                                  </span>
                                  {!variant.isActive && (
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-8">
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">
                                      Price
                                    </div>
                                    <div className="font-medium">
                                      <Money amount={variant.price} />
                                    </div>
                                  </div>
                                  <div className="text-right min-w-[60px]">
                                    <div className="text-xs text-muted-foreground">
                                      Stock
                                    </div>
                                    <div
                                      className={cn(
                                        "font-medium",
                                        variant.stock === 0 &&
                                          "text-destructive",
                                      )}
                                    >
                                      {variant.stock}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-10 w-10 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      No products yet.
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/dashboard/products/new">
                        Create your first product
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
