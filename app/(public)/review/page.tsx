// app/(public)/review/page.tsx
import { validateMagicLinkToken } from "@/server/actions/testimonial.actions";
import { MagicReviewForm } from "@/components/features/testimonial/magic-review-form";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Home,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatBase64Image } from "@/lib/utils";

interface ReviewPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: "Write a Review",
  description: "Share your experience with your recent purchase",
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const token = typeof params.t === "string" ? params.t : null;

  if (!token) {
    notFound();
  }

  // Validate Token and Fetch Data
  const { success, error, order, settings } =
    await validateMagicLinkToken(token);

  if (!success || !order || !settings) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Glow Effect */}
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Link Expired or Invalid
          </h1>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            {error ||
              "We couldn't verify this review link. It may have expired or been used already."}
          </p>

          <Button
            asChild
            size="lg"
            className="rounded-full px-8 gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if already reviewed (and not allowing resubmit)
  const existingTestimonial = order.testimonial;
  const canResubmit =
    existingTestimonial &&
    existingTestimonial.status === "REJECTED" &&
    settings.allowResubmitOnRejected;

  if (existingTestimonial && !canResubmit) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-lg text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Success Animation */}
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Review Submitted
          </h1>
          <p className="mb-8 text-muted-foreground text-lg">
            Thank you for reviewing your order <b>#{order.orderNumber}</b>.
          </p>

          {/* Product List - Minimal Grid */}
          <div className="mb-10 text-left">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
              Review Details
            </h3>
            <div className="grid gap-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 rounded-xl border bg-card/50 p-3 hover:bg-card transition-colors"
                >
                  <div className="relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                    {item.product.images[0]?.base64 ? (
                      <Image
                        src={formatBase64Image(item.product.images[0].base64)}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base leading-tight mb-1 truncate group-hover:text-primary transition-colors">
                      {item.product.name}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {item.variant && <span>{item.variant.name}</span>}
                      {/* <span className="opacity-50">|</span> */}
                      <span className="block w-full sm:w-auto">
                        {order.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="rounded-full px-8 gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Link href="/">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/30 p-4 sm:p-8">
      {/* Header outside the card for the main form to reduce visual noise inside */}
      <div className="mb-8 text-center max-w-xl animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-3 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Share Your Experience
        </h1>
        <p className="text-muted-foreground text-lg">
          We&apos;d love to hear what you think about your order
        </p>
      </div>

      <div className="w-full max-w-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-150">
        <MagicReviewForm
          token={token}
          orderNumber={order.orderNumber}
          orderDateString={order.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          items={order.items}
          minLength={settings.minMessageLength}
          maxLength={settings.maxMessageLength}
        />
      </div>

      <div className="mt-8 text-xs text-muted-foreground animate-in fade-in duration-1000 delay-300">
        &copy; {new Date().getFullYear()} Zinc Store. All rights reserved.
      </div>
    </div>
  );
}
