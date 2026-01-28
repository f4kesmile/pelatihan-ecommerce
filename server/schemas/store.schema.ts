import { z } from "zod"

export const storeConfigSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeCity: z.string().min(1, "City is required"),
  
  heroHeadline: z.string().min(1, "Headline is required"),
  heroSubheadline: z.string().min(1, "Subheadline is required"),
  heroCtaText: z.string().min(1, "CTA Text is required"),
  heroCtaHref: z.string().min(1, "CTA Link is required"),

  companyName: z.string().min(1, "Company name is required"),
  companyAbout: z.string().min(1, "About text is required"),
  companyAddress: z.string().optional(),

  supportEmail: z.string().email("Invalid email"),
  
  whatsappSupport: z.string().min(1, "Support WhatsApp is required"),
  whatsappAdmin: z.string().min(1, "Admin WhatsApp is required"),
  whatsappTemplate: z.string().min(1, "Template is required"),

  termsTitle: z.string().min(1, "Terms title is required"),
  termsContent: z.string().min(1, "Terms content is required"),
  privacyTitle: z.string().optional().nullable(),
  privacyContent: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  showInstagram: z.boolean(),

  facebookUrl: z.string().optional().nullable(),
  showFacebook: z.boolean(),

  twitterUrl: z.string().optional().nullable(),
  showTwitter: z.boolean(),

  tiktokUrl: z.string().optional().nullable(),
  showTiktok: z.boolean(),

  websiteUrl: z.string().optional().nullable(),
  showWebsite: z.boolean(),

  // Footer Config
  footerSocialText: z.string().optional().nullable(),

  supportLinkText: z.string().optional().nullable(),
  supportLinkHref: z.string().optional().nullable(),
  faqLinkText:     z.string().optional().nullable(),
  faqLinkHref:     z.string().optional().nullable(),

  termsLinkText:   z.string().optional().nullable(),
  termsLinkHref:   z.string().optional().nullable(),
  privacyLinkText: z.string().optional().nullable(),
  privacyLinkHref: z.string().optional().nullable(),
})

export type StoreConfigFormValues = z.infer<typeof storeConfigSchema>
