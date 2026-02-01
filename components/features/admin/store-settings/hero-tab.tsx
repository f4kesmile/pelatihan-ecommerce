"use client";

import { useFormContext } from "react-hook-form";
import { StoreConfigFormValues } from "@/server/schemas/store.schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";

export function HeroTab() {
  const form = useFormContext<StoreConfigFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5" />
          Hero Section Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="heroHeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline (Title)</FormLabel>
              <FormControl>
                <Input placeholder="Welcome to our store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroSubheadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subheadline (Description)</FormLabel>
              <FormControl>
                <Textarea placeholder="We sell best items..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="heroCtaText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teks Tombol Utama (CTA)</FormLabel>
                <FormControl>
                  <Input placeholder="Belanja Sekarang" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroCtaHref"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Tombol Utama (CTA)</FormLabel>
                <FormControl>
                  <Input placeholder="/products" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
