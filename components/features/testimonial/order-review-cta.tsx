"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "./review-modal";
import { ReviewStatusBadge } from "./review-status-badge";
import { Star, CheckCircle } from "lucide-react";
import type { Testimonial } from "@prisma/client";

interface OrderReviewCTAProps {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  orderDate: Date;
  testimonial: Testimonial | null;
  reviewWindowDays: number;
  requireOrderSucceeded: boolean;
  allowResubmitOnRejected: boolean;
  onReviewSubmitted?: () => void;
}

export function OrderReviewCTA({
  orderId,
  orderNumber,
  orderStatus,
  orderDate,
  testimonial,
  reviewWindowDays,
  requireOrderSucceeded,
  allowResubmitOnRejected,
  onReviewSubmitted,
}: OrderReviewCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if order is eligible based on status
  if (requireOrderSucceeded && orderStatus !== "SUCCEEDED") {
    return null; // No CTA for non-succeeded orders
  }

  // Check if review window has expired
  const daysSinceOrder =
    (new Date().getTime() - new Date(orderDate).getTime()) /
    (1000 * 60 * 60 * 24);
  const isExpired = daysSinceOrder > reviewWindowDays;

  // Determine if eligible for new review
  const canSubmitReview =
    !isExpired &&
    (!testimonial ||
      (testimonial.status === "REJECTED" && allowResubmitOnRejected));

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
      <ReviewStatusBadge
        testimonial={testimonial}
        isExpired={isExpired}
        isEligible={canSubmitReview}
      />

      {testimonial && testimonial.status === "APPROVED" ? (
        <Button
          size="sm"
          variant="secondary"
          className="ml-auto bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 pointer-events-none"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Sudah Diulas
        </Button>
      ) : canSubmitReview ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="ml-auto border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Star className="h-4 w-4 mr-2" />
          {testimonial?.status === "REJECTED" ? "Kirim Ulang" : "Tulis Review"}
        </Button>
      ) : null}

      {testimonial && testimonial.status === "APPROVED" && (
        <div className="ml-auto text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <ReviewModal
        orderId={orderId}
        orderNumber={orderNumber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onReviewSubmitted}
      />
    </div>
  );
}
