"use client";

import { useCart } from "@/components/features/cart/cart-context";
import { CheckoutForm } from "@/components/features/checkout/checkout-form";
import { getStoreConfig } from "@/server/actions/store.actions";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/money";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [config, setConfig] = useState<{
    whatsappAdmin: string;
    whatsappTemplate: string;
  } | null>(null);

  useEffect(() => {
    getStoreConfig().then((data) => {
      if (data) setConfig(data as any);
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some products to checkout.</p>
        <Button asChild className="mt-4">
          <Link href="/products">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Order Summary */}
        <div>
          <div className="rounded-lg border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative aspect-square h-16 w-16 flex-none overflow-hidden rounded-md border bg-background">
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
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="font-medium text-sm line-clamp-1">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.variantName} x {item.quantity}
                    </span>
                  </div>
                  <Money
                    amount={item.price * item.quantity}
                    className="font-medium self-center"
                  />
                </div>
              ))}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <Money amount={subtotal} className="text-primary" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              * By clicking "Place Order", you will be redirected to WhatsApp to
              send your order details directly to our admin. Payment and
              delivery will be coordinated there.
            </p>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Customer Details</h2>
            <CheckoutForm
              whatsappNumber={config?.whatsappAdmin}
              template={config?.whatsappTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
