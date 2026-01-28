"use client";

import { useFormContext } from "react-hook-form";
import { StoreConfigFormValues } from "@/server/schemas/store.schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headset } from "lucide-react";

export function SupportTab() {
  const form = useFormContext<StoreConfigFormValues>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headset className="h-5 w-5" />
            Customer Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input placeholder="support@zinc.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="whatsappSupport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number (Support)</FormLabel>
                  <FormControl>
                    <Input placeholder="628123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappAdmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number (Admin/Orders)</FormLabel>
                  <FormControl>
                    <Input placeholder="628123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="whatsappTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Order Template</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Halo Admin, saya mau pesan {orderNumber}..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Variables available: {"{orderNumber}"}, {"{customerName}"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Navigation (Support)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="supportLinkText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Link Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contact Support"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportLinkHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/support"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="faqLinkText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FAQ Link Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="FAQ"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faqLinkHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FAQ Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/faq"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
