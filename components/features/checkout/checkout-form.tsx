"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/components/features/cart/cart-context";
import {
  checkoutSchema,
  CheckoutFormValues,
} from "@/server/schemas/checkout.schema";
import { createWhatsAppOrderLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  whatsappNumber?: string;
  template?: string;
}

export function CheckoutForm({ whatsappNumber, template }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  function onSubmit(data: CheckoutFormValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const waLink = createWhatsAppOrderLink({
      items,
      subtotal,
      customer: data,
      adminNumber: whatsappNumber,
      template,
    });

    clearCart();

    toast.success("Order prepared! Redirecting to WhatsApp...");

    setTimeout(() => {
      window.open(waLink, "_blank");
      router.push("/");
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input placeholder="08123456789" type="tel" {...field} />
              </FormControl>
              <FormDescription>
                We will send order update details to this number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Street name, house number, city, postal code..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any special requests?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full">
          Place Order on WhatsApp
        </Button>
      </form>
    </Form>
  );
}
