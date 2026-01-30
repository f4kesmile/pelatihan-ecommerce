"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Star, CheckCircle2, ShoppingBag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReviewViaMagicLink } from "@/server/actions/testimonial.actions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatBase64Image } from "@/lib/utils";
import Image from "next/image";

interface MagicReviewFormProps {
  token: string;
  orderNumber: string;
  orderDateString: string;
  items: {
    product: {
      name: string;
      images: { base64: string }[];
    };
    variant?: {
      name: string;
    } | null;
  }[];
  minLength: number;
  maxLength: number;
}

export function MagicReviewForm({
  token,
  orderNumber,
  orderDateString,
  items,
  minLength,
  maxLength,
}: MagicReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (message.length < minLength) {
      toast.error(`Review message must be at least ${minLength} characters`);
      return;
    }

    startTransition(async () => {
      const result = await submitReviewViaMagicLink(token, {
        rating,
        message,
      });

      if (result.success) {
        setIsSubmitted(true);
        toast.success(result.message || "Review submitted successfully!");
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    });
  };

  if (isSubmitted) {
    return (
      <Card className="mx-auto w-full max-w-md border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-green-500/10 dark:bg-green-500/20 p-8 flex justify-center">
          <div className="bg-background rounded-full p-4 shadow-sm ring-1 ring-green-500/30 animate-in zoom-in duration-500 delay-150">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Thank You!</h2>
          <p className="text-muted-foreground">
            Your review for Order{" "}
            <span className="font-semibold text-foreground">
              #{orderNumber}
            </span>{" "}
            has been submitted successfully.
          </p>
          <Button className="mt-4 min-w-[150px]" asChild>
            <Link href="/">Return to Store</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-2xl border-border/50 overflow-hidden bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center border-b bg-muted/10 pb-6">
        <CardTitle className="text-xl">Write a Review</CardTitle>
        <CardDescription>
          Order{" "}
          <span className="font-medium text-foreground">#{orderNumber}</span> •{" "}
          {orderDateString}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 p-6 sm:p-8">
        {/* Order Items Preview */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Purchased Items
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border p-2 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-background border shadow-sm">
                  {item.product.images[0]?.base64 ? (
                    <Image
                      src={formatBase64Image(item.product.images[0].base64)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-secondary">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate leading-none mb-1">
                    {item.product.name}
                  </p>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.variant.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-4 text-center py-2">
          <Label className="text-base font-medium">
            How was your experience?
          </Label>

          <div className="flex flex-col items-center gap-3">
            <div
              className="flex justify-center gap-1.5 sm:gap-3"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  disabled={isPending}
                  className={cn(
                    "relative p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full",
                    isPending && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-200",
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "fill-muted text-muted-foreground/30",
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <div className="h-6">
              {(hoverRating > 0 || rating > 0) && (
                <p
                  className={cn(
                    "text-sm font-medium animate-in fade-in slide-in-from-bottom-1 duration-300 flex items-center gap-2",
                    (hoverRating || rating) >= 4
                      ? "text-green-600 dark:text-green-400"
                      : (hoverRating || rating) === 3
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-orange-600 dark:text-orange-400",
                  )}
                >
                  {(hoverRating || rating) === 5 && (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Excellent
                    </>
                  )}
                  {(hoverRating || rating) === 4 && (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Very Good
                    </>
                  )}
                  {(hoverRating || rating) === 3 && "Average"}
                  {(hoverRating || rating) === 2 && "Below Average"}
                  {(hoverRating || rating) === 1 && "Poor"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <Label htmlFor="message">Your Review</Label>
          <div className="relative">
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you like or dislike? What should other shoppers know?"
              className="min-h-[140px] resize-none text-base bg-muted/10 focus:bg-background transition-colors"
              disabled={isPending}
              maxLength={maxLength}
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/60 bg-background/80 px-1 rounded pointer-events-none">
              {message.length}/{maxLength}
            </div>
          </div>

          <div className="flex justify-start">
            {message.length > 0 && message.length < minLength && (
              <p className="text-xs text-orange-500 animate-in fade-in slide-in-from-left-1">
                Please write at least {minLength} characters
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/10 p-6">
        <Button
          onClick={handleSubmit}
          className="w-full text-lg h-12 shadow-md transition-all hover:translate-y-[-1px]"
          disabled={isPending || rating === 0 || message.length < minLength}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Submit Review <Send className="h-4 w-4" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
