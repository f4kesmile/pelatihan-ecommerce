import { Suspense } from "react";
import { getReviewSettingsWithDefaults } from "@/server/actions/review-settings.actions";
import { ReviewSettingsForm } from "@/components/features/admin/review-settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Review System Settings",
  description: "Configure multi-channel review system settings",
};

async function ReviewSettingsContent() {
  const result = await getReviewSettingsWithDefaults();

  if (!result.success) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Failed to load settings: {result.error}
        </p>
      </div>
    );
  }

  return <ReviewSettingsForm initialData={result.data} />;
}

function ReviewSettingsLoading() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewSettingsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Review System Settings</CardTitle>
          <CardDescription>
            Configure how customers can submit reviews via Magic Link
            (WhatsApp), Smart Popup, and My Orders. All settings are dynamic and
            take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ReviewSettingsLoading />}>
            <ReviewSettingsContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
