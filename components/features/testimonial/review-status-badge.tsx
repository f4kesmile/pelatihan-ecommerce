import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Calendar } from "lucide-react";
import type { Testimonial } from "@prisma/client";

interface ReviewStatusBadgeProps {
  testimonial: Testimonial | null;
  isExpired: boolean;
  isEligible: boolean;
}

export function ReviewStatusBadge({
  testimonial,
  isExpired,
  isEligible,
}: ReviewStatusBadgeProps) {
  // If expired
  if (isExpired) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        Review Expired
      </Badge>
    );
  }

  // If has testimonial
  if (testimonial) {
    switch (testimonial.status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Menunggu Moderasi
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-600"
          >
            <CheckCircle className="h-3 w-3" />
            Review Terkirim
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Ditolak
          </Badge>
        );
      case "HIDDEN":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Disembunyikan
          </Badge>
        );
    }
  }

  // If eligible for review
  if (isEligible) {
    return null; // Show button instead
  }

  // Not eligible
  return null;
}
