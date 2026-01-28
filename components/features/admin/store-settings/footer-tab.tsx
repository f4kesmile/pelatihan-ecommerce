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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Instagram,
  Facebook,
  Twitter,
  Music2,
  Globe,
  Share2,
} from "lucide-react";

export function FooterTab() {
  const form = useFormContext<StoreConfigFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media & Footer Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="footerSocialText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connect Text (Displayed above icons)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Follow us on social media for updates."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Instagram */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="flex items-center gap-4 mb-2">
              <Instagram className="h-5 w-5 text-pink-600" />
              <FormField
                control={form.control}
                name="showInstagram"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Show on Footer
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://instagram.com/yourstore"
                      disabled={!form.watch("showInstagram")}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Facebook */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="flex items-center gap-4 mb-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              <FormField
                control={form.control}
                name="showFacebook"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Show on Footer
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/yourstore"
                      disabled={!form.watch("showFacebook")}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Twitter */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="flex items-center gap-4 mb-2">
              <Twitter className="h-5 w-5 text-sky-500" />
              <FormField
                control={form.control}
                name="showTwitter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Show on Footer
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://twitter.com/yourstore"
                      disabled={!form.watch("showTwitter")}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* TikTok */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="flex items-center gap-4 mb-2">
              <Music2 className="h-5 w-5 text-pink-500" />
              <FormField
                control={form.control}
                name="showTiktok"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Show on Footer
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tiktokUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://tiktok.com/@yourstore"
                      disabled={!form.watch("showTiktok")}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Website */}
          <div className="rounded-lg border p-3 bg-muted/30 col-span-full md:col-span-2">
            <div className="flex items-center gap-4 mb-2">
              <Globe className="h-5 w-5 text-green-600" />
              <FormField
                control={form.control}
                name="showWebsite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Show on Footer (Website)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://yourwebsite.com"
                      disabled={!form.watch("showWebsite")}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
