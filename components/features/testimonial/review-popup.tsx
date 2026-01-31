"use client";

import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReviewModal } from "./review-modal";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface ReviewPopupProps {
  orderId: string;
  orderNumber: string;
  productName: string;
  productImage: string | null;
}

export function ReviewPopup({
  orderId,
  orderNumber,
  productName,
  productImage,
}: ReviewPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`dismissed_review_popup_${orderId}`);

    if (dismissed) {
      const t = setTimeout(() => setHasChecked(true), 0);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasChecked(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`dismissed_review_popup_${orderId}`, "true");
  };

  const handleOpenReview = () => {
    setIsVisible(false);
    setIsModalOpen(true);
  };

  const handleReviewSuccess = () => {
    localStorage.setItem(`dismissed_review_popup_${orderId}`, "true");
  };

  if (hasChecked && !isVisible && !isModalOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 w-[350px] shadow-2xl"
          >
            <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex p-4 gap-4">
                <div className="h-16 w-16 flex-shrink-0 rounded-md bg-muted overflow-hidden border">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <Star className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                    How was your {productName}?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Order #{orderNumber}
                  </p>

                  <div className="flex pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={handleOpenReview}
                        className="text-gray-300 hover:text-yellow-400 hover:scale-110 transition-transform"
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewModal
        orderId={orderId}
        orderNumber={orderNumber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}
