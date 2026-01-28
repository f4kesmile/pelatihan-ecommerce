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
import { Building2 } from "lucide-react";

export function CompanyTab() {
  const form = useFormContext<StoreConfigFormValues>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Zinc Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAbout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About (Displayed in Footer)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Zinc Store is a leading provider of..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="123 Zinc Street..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="termsTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms Page Title</FormLabel>
                <FormControl>
                  <Input placeholder="Terms and Conditions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termsContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms Content (Markdown/HTML)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="## 1. Introduction..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="privacyTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Privacy Page Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Privacy Policy"
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
            name="privacyContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Privacy Content (Markdown/HTML)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="## Privacy Policy..."
                    className="min-h-[200px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Navigation (Legal)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="termsLinkText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms Link Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Terms & Conditions"
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
              name="termsLinkHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/terms"
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
              name="privacyLinkText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Link Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Privacy Policy"
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
              name="privacyLinkHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/privacy"
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
