"use client";

import { useState, useTransition } from "react";
import { Star, Frown, Meh, Smile, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReviewFromMyOrders } from "@/server/actions/testimonial.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  orderId: string;
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  minLength?: number;
  maxLength?: number;
}

const FEEDBACK_LABELS = {
  1: { label: "Sangat tidak memuaskan", icon: Frown, color: "text-red-500" },
  2: { label: "Kurang memuaskan", icon: Meh, color: "text-orange-500" },
  3: { label: "Cukup baik", icon: Meh, color: "text-yellow-500" },
  4: { label: "Sangat baik!", icon: Smile, color: "text-green-500" },
  5: { label: "Luar biasa!", icon: Heart, color: "text-pink-500" },
} as const;

export function ReviewModal({
  orderId,
  orderNumber,
  isOpen,
  onClose,
  onSuccess,
  minLength = 10,
  maxLength = 300,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      toast.error("Mohon pilih rating terlebih dahulu");
      return;
    }

    if (message.length < minLength) {
      toast.error(`Review message must be at least ${minLength} characters`);
      return;
    }

    if (message.length > maxLength) {
      toast.error(`Review message must not exceed ${maxLength} characters`);
      return;
    }

    // Submit
    startTransition(async () => {
      const result = await submitReviewFromMyOrders({
        orderId,
        rating,
        message,
      });

      if (result.success) {
        toast.success(result.message || "Review submitted successfully!");
        setRating(0);
        setMessage("");
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setRating(0);
      setMessage("");
      onClose();
    }
  };

  const activeRating = hoverRating || rating;
  const FeedbackIcon =
    activeRating > 0
      ? FEEDBACK_LABELS[activeRating as keyof typeof FEEDBACK_LABELS].icon
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tulis Review</DialogTitle>
          <DialogDescription>
            Bagikan pengalaman Anda untuk pesanan{" "}
            <span className="font-semibold text-foreground">
              #{orderNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-4 text-center">
            <Label className="sr-only">Rating</Label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isPending}
                  className={cn(
                    "transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full p-1",
                    isPending && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors duration-200",
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30 hover:text-amber-400",
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="h-6 flex items-center justify-center gap-2 transition-all duration-300">
              {activeRating > 0 && FeedbackIcon ? (
                <div
                  className={cn(
                    "flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 font-medium",
                    FEEDBACK_LABELS[
                      activeRating as keyof typeof FEEDBACK_LABELS
                    ].color,
                  )}
                >
                  <FeedbackIcon className="h-4 w-4" />
                  <span>
                    {
                      FEEDBACK_LABELS[
                        activeRating as keyof typeof FEEDBACK_LABELS
                      ].label
                    }
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Bagaimana kualitas produk ini?
                </span>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Pesan Review</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ceritakan pengalaman belanja Anda..."
              className="min-h-[120px] resize-none focus-visible:ring-offset-0"
              disabled={isPending}
              maxLength={maxLength}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimal {minLength} karakter</span>
              <span
                className={cn(
                  "transition-colors",
                  message.length > maxLength
                    ? "text-destructive font-medium"
                    : "",
                  message.length >= minLength
                    ? "text-green-600 dark:text-green-400"
                    : "",
                )}
              >
                {message.length} / {maxLength}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || rating === 0 || message.length < minLength}
            className="gap-2"
          >
            {isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {isPending ? "Mengirim..." : "Kirim Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
