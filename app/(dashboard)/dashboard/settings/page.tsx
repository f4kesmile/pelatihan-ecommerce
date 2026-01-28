import { getStoreConfig } from "@/server/actions/store.actions";
import { StoreSettingsPage } from "@/components/features/admin/store-settings/store-settings-page";

export default async function SettingsPage() {
  const config = await getStoreConfig();

  // Explicitly cast to undefined if null/empty and sanitize nulls
  const initialData = config
    ? {
        ...config,
        companyAddress: config.companyAddress || undefined,
        logoBase64: config.logoBase64 || undefined,
        logoMime: config.logoMime || undefined,
        logoSize: config.logoSize || undefined,
        instagramUrl: config.instagramUrl || undefined,
        facebookUrl: config.facebookUrl || undefined,
        twitterUrl: config.twitterUrl || undefined,
        tiktokUrl: config.tiktokUrl || undefined,
        websiteUrl: config.websiteUrl || undefined,

        // Privacy
        privacyTitle: config.privacyTitle || undefined,
        privacyContent: config.privacyContent || undefined,

        // Footer Customization
        footerSocialText: config.footerSocialText || undefined,
        supportLinkText: config.supportLinkText || undefined,
        supportLinkHref: config.supportLinkHref || undefined,
        faqLinkText: config.faqLinkText || undefined,
        faqLinkHref: config.faqLinkHref || undefined,
        termsLinkText: config.termsLinkText || undefined,
        termsLinkHref: config.termsLinkHref || undefined,
        privacyLinkText: config.privacyLinkText || undefined,
        privacyLinkHref: config.privacyLinkHref || undefined,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <StoreSettingsPage initialData={initialData} />
    </div>
  );
}
