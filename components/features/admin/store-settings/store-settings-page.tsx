"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  storeConfigSchema,
  StoreConfigFormValues,
} from "@/server/schemas/store.schema";
import { updateStoreConfig } from "@/server/actions/store.actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
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
      supportLinkText: "",
      supportLinkHref: "",
      faqLinkText: "",
      faqLinkHref: "",
      termsLinkText: "",
      termsLinkHref: "",
      privacyLinkText: "",
      privacyLinkHref: "",
    },
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
