"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/money";
import { useCart } from "@/components/features/cart/cart-context";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductBuyDrawerProps {
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    variants: Variant[];
  };
  children: React.ReactNode;
}

export function ProductBuyDrawer({ product, children }: ProductBuyDrawerProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const maxQty = selectedVariant?.stock ?? 1;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Pilih variant terlebih dahulu");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: selectedVariant.price,
        variantName: selectedVariant.name,
        maxStock: selectedVariant.stock,
      });
    }
    toast.success(
      `${quantity}x ${selectedVariant.name} ditambahkan ke keranjang`,
    );
    setOpen(false);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Pilih variant terlebih dahulu");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: selectedVariant.price,
        variantName: selectedVariant.name,
        maxStock: selectedVariant.stock,
      });
    }
    setOpen(false);
    router.push("/cart");
  };

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left pb-3">
            <div className="flex gap-3 items-start">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No Img
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <DrawerTitle className="text-sm leading-tight line-clamp-2">
                  {product.name}
                </DrawerTitle>
                {selectedVariant && (
                  <div className="mt-1.5">
                    <Money
                      amount={selectedVariant.price}
                      className="text-base font-bold text-primary"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Stok: {selectedVariant.stock}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4 pt-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Pilih Variant
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  disabled={variant.stock === 0}
                  onClick={() => handleVariantSelect(variant)}
                  className={`
                    rounded-md border px-1 py-1.5 text-center text-[11px] font-medium transition-all leading-tight
                    ${
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                        : "border-border hover:bg-muted/50"
                    }
                    ${variant.stock === 0 ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}
                  `}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-5 pt-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Jumlah
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="text-sm font-semibold w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              {selectedVariant && (
                <span className="text-[11px] text-muted-foreground ml-auto">
                  Total:{" "}
                  <Money
                    amount={selectedVariant.price * quantity}
                    className="inline text-xs font-semibold text-foreground"
                  />
                </span>
              )}
            </div>
          </div>

          <div className="border-t" />

          <DrawerFooter className="pt-4">
            <div className="flex gap-2 w-full">
              <Button
                className="flex-[8]"
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                Beli Sekarang
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="flex-[2] min-w-0"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
              >
                Batal
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
