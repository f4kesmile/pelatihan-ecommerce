"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/money";
import { ProductGallery } from "./product-gallery";
import { useCart } from "@/components/features/cart/cart-context";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingCart, Zap } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    categoryName: string;
    slug: string;
    images: { id: string; src: string; alt: string }[];
    variants: Variant[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null,
  );
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();

  const maxQuantity = selectedVariant?.stock || 1;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, maxQuantity)));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.src || null,
      price: selectedVariant.price,
      variantName: selectedVariant.name,
      maxStock: selectedVariant.stock,
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.src || null,
      price: selectedVariant.price,
      variantName: selectedVariant.name,
      maxStock: selectedVariant.stock,
      quantity: quantity,
    });

    router.push("/cart");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images} />

      <div className="flex flex-col gap-6">
        <div>
          <Badge variant="secondary" className="mb-2">
            {product.categoryName}
          </Badge>
          <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
        </div>

        <div className="flex items-baseline gap-2">
          {selectedVariant ? (
            <Money
              amount={selectedVariant.price}
              className="text-3xl font-bold text-primary"
            />
          ) : (
            <span className="text-3xl font-bold text-muted-foreground">
              Unavailable
            </span>
          )}
        </div>

        <div className="prose prose-sm text-muted-foreground dark:prose-invert">
          <h3 className="text-foreground font-medium mb-2">Description</h3>
          <p>{product.description || "No description available."}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Variants</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className={`
                            relative flex cursor-pointer items-center justify-between gap-2 rounded-lg border p-4 transition-all hover:bg-muted/50
                            ${selectedVariant?.id === variant.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"}
                            ${variant.stock === 0 ? "opacity-50 pointer-events-none" : ""}
                        `}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{variant.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Stock: {variant.stock}
                  </span>
                </div>
                {selectedVariant?.id === variant.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium">Quantity</h3>
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {selectedVariant && (
            <span className="text-xs text-muted-foreground">
              Max: {selectedVariant.stock}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-base"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1 text-base"
              onClick={handleBuyNow}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <Zap className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Secure checkout via WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
