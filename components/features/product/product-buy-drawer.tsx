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
import { ShoppingCart, Zap } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Pilih variant terlebih dahulu");
      return;
    }

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
    setOpen(false);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Pilih variant terlebih dahulu");
      return;
    }

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
    setOpen(false);
    router.push("/cart");
  };

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <div className="flex gap-3 items-center">
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
                <DrawerTitle className="text-base line-clamp-2">
                  {product.name}
                </DrawerTitle>
                {selectedVariant && (
                  <Money
                    amount={selectedVariant.price}
                    className="text-lg font-bold text-primary mt-1"
                  />
                )}
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-2">
            <p className="text-sm font-medium mb-3">Pilih Variant</p>
            <div className="grid grid-cols-5 gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  disabled={variant.stock === 0}
                  onClick={() => setSelectedVariant(variant)}
                  className={`
                    rounded-lg border px-2 py-2.5 text-center text-xs font-medium transition-all
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

          <DrawerFooter>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Keranjang
              </Button>
              <Button
                className="flex-1"
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <Zap className="mr-2 h-4 w-4" />
                Beli Sekarang
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full">
                Batal
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
