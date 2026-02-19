"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  storeConfigSchema,
  StoreConfigFormValues,
} from "@/server/schemas/store.schema";
import { updateStoreConfig } from "@/server/actions/store.actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./general-tab";
import { HeroTab } from "./hero-tab";
import { CompanyTab } from "./company-tab";
import { SupportTab } from "./support-tab";
import { FooterTab } from "./footer-tab";

interface StoreSettingsPageProps {
  initialData?: StoreConfigFormValues;
}

export function StoreSettingsPage({ initialData }: StoreSettingsPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues: StoreConfigFormValues = {
    storeName: initialData?.storeName ?? "",
    storeCity: initialData?.storeCity ?? "",
    heroHeadline: initialData?.heroHeadline ?? "",
    heroSubheadline: initialData?.heroSubheadline ?? "",
    heroCtaText: initialData?.heroCtaText ?? "",
    heroCtaHref: initialData?.heroCtaHref ?? "",
    heroProductsMode: initialData?.heroProductsMode ?? "RANDOM",
    heroProductIds: initialData?.heroProductIds ?? [],
    heroProductConfigs: initialData?.heroProductConfigs ?? [],
    companyName: initialData?.companyName ?? "",
    companyAbout: initialData?.companyAbout ?? "",
    companyAddress: initialData?.companyAddress ?? undefined,
    supportEmail: initialData?.supportEmail ?? "",
    whatsappSupport: initialData?.whatsappSupport ?? "",
    whatsappAdmin: initialData?.whatsappAdmin ?? "",
    whatsappTemplate: initialData?.whatsappTemplate ?? "",
    termsTitle: initialData?.termsTitle ?? "",
    termsContent: initialData?.termsContent ?? "",
    instagramUrl: initialData?.instagramUrl ?? undefined,
    showInstagram: initialData?.showInstagram ?? false,
    facebookUrl: initialData?.facebookUrl ?? undefined,
    showFacebook: initialData?.showFacebook ?? false,
    shopeeUrl: initialData?.shopeeUrl ?? undefined,
    showShopee: initialData?.showShopee ?? false,
    tiktokUrl: initialData?.tiktokUrl ?? undefined,
    showTiktok: initialData?.showTiktok ?? false,
    websiteUrl: initialData?.websiteUrl ?? undefined,
    showWebsite: initialData?.showWebsite ?? false,
    supportLinkText: initialData?.supportLinkText ?? undefined,
    supportLinkHref: initialData?.supportLinkHref ?? undefined,
    faqLinkText: initialData?.faqLinkText ?? undefined,
    faqLinkHref: initialData?.faqLinkHref ?? undefined,
    termsLinkText: initialData?.termsLinkText ?? undefined,
    termsLinkHref: initialData?.termsLinkHref ?? undefined,
    privacyLinkText: initialData?.privacyLinkText ?? undefined,
    privacyLinkHref: initialData?.privacyLinkHref ?? undefined,
    footerSocialText: initialData?.footerSocialText ?? undefined,
    privacyTitle: initialData?.privacyTitle ?? undefined,
    privacyContent: initialData?.privacyContent ?? undefined,
  } as StoreConfigFormValues;

  const form = useForm<StoreConfigFormValues>({
    resolver: zodResolver(
      storeConfigSchema,
    ) as unknown as Resolver<StoreConfigFormValues>,
    defaultValues,
  });

  const onSubmit = async (data: StoreConfigFormValues) => {
    setLoading(true);
    try {
      const res = await updateStoreConfig(data);
      if (res.error) throw new Error(res.error);
      toast.success("Settings updated successfully");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update settings";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Store Configuration
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="hero">Hero Page</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="footer">Footer & Social</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="general">
                <GeneralTab />
              </TabsContent>
              <TabsContent value="hero">
                <HeroTab />
              </TabsContent>
              <TabsContent value="company">
                <CompanyTab />
              </TabsContent>
              <TabsContent value="footer">
                <FooterTab />
              </TabsContent>
              <TabsContent value="support">
                <SupportTab />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end pt-6 border-t mt-8">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="shadow-sm w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Save All Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
