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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSelector } from "./product-selector";

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
      <CardContent className="space-y-6">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-sm text-foreground/80">
            Hero Images & Products
          </h3>
          <FormField
            control={form.control}
            name="heroProductsMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Mode</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RANDOM">
                      Random Popular Products (Automatic)
                    </SelectItem>
                    <SelectItem value="MANUAL">
                      Select Specific Products
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("heroProductsMode") === "MANUAL" && (
            <FormField
              control={form.control}
              name="heroProductConfigs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Products & Images</FormLabel>
                  <FormControl>
                    <ProductSelector
                      selectedConfigs={field.value || []}
                      onSelect={field.onChange}
                      maxItems={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
