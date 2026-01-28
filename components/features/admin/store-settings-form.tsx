"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  storeConfigSchema,
  StoreConfigFormValues,
} from "@/server/schemas/store.schema";
import { updateStoreConfig } from "@/server/actions/store.actions";
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
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Save,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Music2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StoreSettingsFormProps {
  initialData?: StoreConfigFormValues;
}

export function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<StoreConfigFormValues>({
    resolver: zodResolver(storeConfigSchema),
    defaultValues: initialData || {
      storeName: "",
      storeCity: "",
      heroHeadline: "",
      heroSubheadline: "",
      heroCtaText: "",
      heroCtaHref: "",
      companyName: "",
      companyAbout: "",
      companyAddress: "",
      supportEmail: "",
      whatsappSupport: "",
      whatsappAdmin: "",
      whatsappTemplate: "",
      termsTitle: "",
      termsContent: "",
      instagramUrl: "",
      showInstagram: false,
      facebookUrl: "",
      showFacebook: false,
      twitterUrl: "",
      showTwitter: false,
      tiktokUrl: "",
      showTiktok: false,
      websiteUrl: "",
      showWebsite: false,
    },
  });

  const onSubmit = async (data: StoreConfigFormValues) => {
    setLoading(true);
    try {
      const res = await updateStoreConfig(data);
      if (res.error) throw new Error(res.error);
      toast.success("Settings updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* General Store Info */}
          <div className="space-y-6 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Store Identity</h3>
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr />
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <FormField
              control={form.control}
              name="heroHeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
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
                  <FormLabel>Subheadline</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heroCtaText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Text</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
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
                    <FormLabel>CTA Link</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact & Technical */}
          <div className="space-y-6 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Company & Contact</h3>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
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
                  <FormLabel>About (Footer)</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="whatsappSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WA Support</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
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
                    <FormLabel>WA Admin (Orders)</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
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
                  <FormLabel>WA Order Template</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      {...field}
                      placeholder="Halo Admin, saya mau pesan {orderNumber}..."
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Variables: {"{orderNumber}"}, {"{customerName}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-6 rounded-lg border p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Social Media & Links
            <span className="text-xs font-normal text-muted-foreground">
              (Toggle to enable/disable on footer)
            </span>
          </h3>

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
                          disabled={loading}
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
                        disabled={loading || !form.watch("showInstagram")}
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
                          disabled={loading}
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
                        disabled={loading || !form.watch("showFacebook")}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Twitter/X */}
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
                          disabled={loading}
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
                        disabled={loading || !form.watch("showTwitter")}
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
                          disabled={loading}
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
                        disabled={loading || !form.watch("showTiktok")}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Globe / Website */}
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
                          disabled={loading}
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
                        disabled={loading || !form.watch("showWebsite")}
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
        </div>

        <div className="flex justify-end sticky bottom-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
