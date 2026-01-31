"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Copy, Check, Star } from "lucide-react";
import { generateTestimonialToken } from "@/server/actions/testimonial.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TestimonialRequestButtonProps {
  orderId: string;
  customerName: string;
  customerPhone?: string | null;
}

const CONSTANTS = {
  TITLE: "Request Testimonial",
  DESCRIPTION: (orderId: string) =>
    `Generate a magic link for Order #${orderId.slice(-6).toUpperCase()}`,
  PLACEHOLDER: "Generating secure link...",
  COPY_SUCCESS: "Link copied to clipboard",
  GENERATE_ERROR: "Failed to generate link",
  WHATSAPP_ERROR: "No phone number available",
  BUTTON_LABEL: "Request Review",
  COPY_LABEL: "Copy Link",
  WHATSAPP_LABEL: "Send via WhatsApp",
  CLOSE_LABEL: "Close",
  MSG_TEMPLATE: (name: string, link: string) =>
    `Hi ${name}, thanks for shopping with us! We'd love to hear your feedback. Please leave a review here: ${link}`,
};

export function TestimonialRequestButton({
  orderId,
  customerName,
  customerPhone,
}: TestimonialRequestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [magicLink, setMagicLink] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const result = await generateTestimonialToken(orderId);
      if (result.success && result.token) {
        const url = `${window.location.origin}/review?t=${result.token}`;
        setMagicLink(url);
      } else {
        toast.error(CONSTANTS.GENERATE_ERROR);
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(magicLink);
    setHasCopied(true);
    toast.success(CONSTANTS.COPY_SUCCESS);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!customerPhone) {
      toast.error(CONSTANTS.WHATSAPP_ERROR);
      return;
    }

    let phone = customerPhone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.substring(1);
    }

    const message = CONSTANTS.MSG_TEMPLATE(customerName, magicLink);
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
          onClick={() => !magicLink && handleGenerateLink()}
        >
          <Star className="h-4 w-4" />
          {CONSTANTS.BUTTON_LABEL}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{CONSTANTS.TITLE}</DialogTitle>
          <DialogDescription>
            {CONSTANTS.DESCRIPTION(orderId)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="link"
                  value={magicLink}
                  readOnly
                  placeholder={CONSTANTS.PLACEHOLDER}
                  className={cn(
                    "pr-10 transition-all",
                    !magicLink && "opacity-50",
                  )}
                />
                {isLoading && !magicLink && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="shrink-0 transition-all hover:bg-muted"
                onClick={handleCopy}
                disabled={!magicLink}
                title={CONSTANTS.COPY_LABEL}
              >
                {hasCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {magicLink && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Button
                onClick={handleWhatsApp}
                className="w-full gap-2 transition-all hover:shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                {CONSTANTS.WHATSAPP_LABEL}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            {CONSTANTS.CLOSE_LABEL}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
