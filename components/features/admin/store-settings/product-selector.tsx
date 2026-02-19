"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  X,
  Loader2,
  Search,
  ImageIcon,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  searchProducts,
  getProductsByIds,
} from "@/server/actions/product-select.actions";

interface ProductImage {
  base64: string;
  mimeType: string;
}

interface Product {
  id: string;
  name: string;
  images: ProductImage[];
}

export interface HeroProductConfig {
  productId: string;
  image?: string;
}

interface ProductSelectorProps {
  selectedConfigs: HeroProductConfig[];
  onSelect: (configs: HeroProductConfig[]) => void;
  maxItems?: number;
}

export function ProductSelector({
  selectedConfigs = [],
  onSelect,
  maxItems = 3,
}: ProductSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    async function loadSelected() {
      const ids = selectedConfigs.map((c) => c.productId);
      if (ids.length > 0) {
        const missingIds = ids.filter(
          (id) => !selectedProducts.find((p) => p.id === id),
        );
        if (missingIds.length > 0) {
          const result = await getProductsByIds(ids);
          if (result.success && result.data) {
            setSelectedProducts((prev) => {
              const newProds =
                result.data?.filter(
                  (p) => !prev.find((existing) => existing.id === p.id),
                ) || [];
              return [...prev, ...newProds];
            });
          }
        }
      } else {
        if (selectedConfigs.length === 0 && selectedProducts.length > 0) {
          setSelectedProducts([]);
        }
      }
    }
    loadSelected();
  }, [selectedConfigs, selectedProducts]);

  const fetchProducts = async (term: string) => {
    setLoading(true);
    const result = await searchProducts(term);
    setLoading(false);
    if (result.success && result.data) {
      setProducts(result.data);
    }
  };

  const debouncedSearch = useDebouncedCallback((term: string) => {
    fetchProducts(term);
  }, 300);

  React.useEffect(() => {
    if (open && products.length === 0 && !query) {
      fetchProducts("");
    }
  }, [open, products.length, query]);

  const toggleProduct = (product: Product) => {
    const isSelected = selectedConfigs.some((c) => c.productId === product.id);
    let newConfigs = [];

    if (isSelected) {
      newConfigs = selectedConfigs.filter((c) => c.productId !== product.id);
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      if (selectedConfigs.length >= maxItems) return;

      const defaultImage = product.images[0]
        ? `data:${product.images[0].mimeType};base64,${product.images[0].base64}`
        : undefined;

      newConfigs = [
        ...selectedConfigs,
        { productId: product.id, image: defaultImage },
      ];
      setSelectedProducts((prev) => [...prev, product]);
    }

    onSelect(newConfigs);
  };

  const updateProductImage = (productId: string, image: string) => {
    const newConfigs = selectedConfigs.map((c) =>
      c.productId === productId ? { ...c, image } : c,
    );
    onSelect(newConfigs);
  };

  const removeProduct = (id: string) => {
    const newConfigs = selectedConfigs.filter((c) => c.productId !== id);
    onSelect(newConfigs);
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductImage = (p: Product) => {
    if (p.images && p.images.length > 0) {
      return `data:${p.images[0].mimeType};base64,${p.images[0].base64}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Selected Products Grid */}
      <div className="grid grid-cols-1 gap-4">
        {selectedProducts.map((product) => {
          const config = selectedConfigs.find(
            (c) => c.productId === product.id,
          );
          const activeImage = config?.image || getProductImage(product);

          return (
            <Card
              key={product.id}
              className="relative overflow-hidden group border-muted-foreground/20"
            >
              <CardContent className="p-4 flex gap-4 items-start">
                {/* Selected Image Preview */}
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted border shrink-0">
                  {activeImage ? (
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold truncate pr-8">
                      {product.name}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-2 right-2 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image Variants */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Select Hero Image:
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {product.images.map((img, idx) => {
                        const imgSrc = `data:${img.mimeType};base64,${img.base64}`;
                        const isActive = imgSrc === activeImage;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              updateProductImage(product.id, imgSrc)
                            }
                            className={cn(
                              "relative w-10 h-10 rounded-md overflow-hidden border-2 transition-all shrink-0",
                              isActive
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent opacity-70 hover:opacity-100",
                            )}
                          >
                            <Image
                              src={imgSrc}
                              alt="Variant"
                              fill
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {selectedConfigs.length === 0 && (
          <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
            No products selected. Click below to add up to {maxItems} products.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 dashed border-primary/50 text-primary hover:bg-primary/5"
            disabled={selectedConfigs.length >= maxItems}
          >
            {selectedConfigs.length >= maxItems
              ? `Max ${maxItems} products reached`
              : "+ Add Product"}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[500px] p-0 gap-0">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle>Select Products</DialogTitle>
          </DialogHeader>
          <div className="p-3 border-b bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
              />
              {loading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
          <ScrollArea className="h-[400px] p-2">
            {products.length === 0 && !loading && (
              <div className="py-12 text-center text-muted-foreground">
                {query ? "No products found." : "No available products."}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {products.map((product) => {
                const isSelected = selectedConfigs.some(
                  (c) => c.productId === product.id,
                );
                const thumb = getProductImage(product);

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors border",
                      isSelected
                        ? "bg-primary/5 border-primary/30"
                        : "hover:bg-accent border-transparent",
                    )}
                    onClick={() => toggleProduct(product)}
                  >
                    <div className="relative w-12 h-12 rounded bg-muted overflow-hidden shrink-0 border">
                      {thumb && (
                        <Image
                          src={thumb}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.images.length} Image Variants
                      </p>
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
