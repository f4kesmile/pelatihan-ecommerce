"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./cart-context";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Money } from "@/components/shared/money";
import Link from "next/link";
import Image from "next/image";

export function CartSheet() {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 py-4 pr-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative aspect-square h-20 w-20 min-w-fit overflow-hidden rounded-md border bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          className="line-clamp-1 text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        <Money
                          amount={item.price * item.quantity}
                          className="text-sm font-medium"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.variantName}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 border rounded-md p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6 pb-6 pr-6">
              <Separator />
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <Money amount={subtotal} />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/cart">View Cart & Checkout</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 p-8 text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 opacity-20" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Add items to get started</p>
            <SheetClose asChild>
              <Button variant="link" asChild className="mt-4">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
