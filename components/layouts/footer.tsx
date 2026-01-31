import Link from "next/link";
import { Instagram, Facebook, Twitter, Globe, Music2 } from "lucide-react";
import { getStoreConfig } from "@/server/actions/store.actions";

export async function Footer() {
  const config = await getStoreConfig();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Footer</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Our Store</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {config?.companyAbout ||
                "Premium products curated for you. Quality guaranteed."}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={config?.supportLinkHref || "/support"}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {config?.supportLinkText || "Contact Support"}
                </Link>
              </li>
              <li>
                <Link
                  href={config?.faqLinkHref || "/support"}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {config?.faqLinkText || "FAQ"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={config?.termsLinkHref || "/terms"}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {config?.termsLinkText || "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link
                  href={config?.privacyLinkHref || "/privacy"}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {config?.privacyLinkText || "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Connect</h3>
            <p className="text-sm text-muted-foreground">
              {config?.footerSocialText ||
                "Follow us on social media for updates."}
            </p>
            <div className="flex gap-4 pt-2">
              {config?.showInstagram && config?.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-pink-600 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {config?.showFacebook && config?.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {config?.showTwitter && config?.twitterUrl && (
                <a
                  href={config.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-sky-500 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {config?.showTiktok && config?.tiktokUrl && (
                <a
                  href={config.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-pink-500 transition-colors"
                  title="TikTok"
                >
                  <Music2 className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </a>
              )}
              {config?.showWebsite && config?.websiteUrl && (
                <a
                  href={config.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-green-600 transition-colors"
                  title="Website"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config?.companyName || "Zinc Store"}.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
