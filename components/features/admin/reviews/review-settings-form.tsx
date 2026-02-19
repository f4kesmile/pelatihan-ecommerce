"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  reviewSettingsSchema,
  ReviewSettingsInput,
} from "@/server/schemas/review-settings.schema";
import { updateReviewSettings } from "@/server/actions/review-settings.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface ReviewSettingsFormProps {
  initialData?: Partial<ReviewSettingsInput>;
}

export function ReviewSettingsForm({ initialData }: ReviewSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(reviewSettingsSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: ReviewSettingsInput) => {
    startTransition(async () => {
      try {
        const result = await updateReviewSettings(data);

        if (result.success) {
          toast.success("Review settings updated successfully!");
        } else {
          toast.error(result.error || "Failed to update settings");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Settings</h3>
          <Separator />

          <FormField
            control={form.control}
            name="reviewsEnabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Enable Review System</FormLabel>
                  <FormDescription>
                    Turn on/off the entire review system
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requireOrderSucceeded"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Require Order Succeeded</FormLabel>
                  <FormDescription>
                    Only allow reviews for completed orders
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oneReviewPerOrder"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>One Review Per Order</FormLabel>
                  <FormDescription>
                    Prevent duplicate reviews for the same order
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewWindowDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Window (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many days after order completion can user submit review
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moderationRequired"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Moderation Required</FormLabel>
                  <FormDescription>
                    Reviews need admin approval before showing
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Magic Link (WhatsApp)</h3>
          <Separator />

          <FormField
            control={form.control}
            name="tokenExpiryHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Expiry (Hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How long magic link tokens remain valid (720 hours = 30 days)
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowTokenRegenerate"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Allow Token Regeneration</FormLabel>
                  <FormDescription>
                    Admin can regenerate expired/used tokens
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="waTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Template</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormDescription>
                  Use placeholders: {"{customerName}"}, {"{orderCode}"},{" "}
                  {"{reviewLink}"}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Smart Popup</h3>
          <Separator />

          <FormField
            control={form.control}
            name="popupEnabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Enable Popup</FormLabel>
                  <FormDescription>
                    Show smart popup for engaged users
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="popupMinSessions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Sessions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Daily visits required</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popupMinDaysSinceFirstSeen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Days Since First Seen</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Days since first visit</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popupMinSecondsOnSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Seconds On Site</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Time spent in session</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popupCooldownDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooldown (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Wait time between popups</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popupMaxImpressionsPerWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Impressions Per Window</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Max shows per cooldown period
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="popupOnlyIfEligibleOrdersExist"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Only Show If Has Eligible Orders</FormLabel>
                  <FormDescription>
                    Don&apos;t show popup to users without eligible orders
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="popupTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popup Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="popupBody"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popup Body</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="successMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Success Message</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Orders CTA</h3>
          <Separator />

          <FormField
            control={form.control}
            name="myOrdersReviewEnabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Enable My Orders Review</FormLabel>
                  <FormDescription>
                    Show review CTA in My Orders page
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showReviewForLastNOrders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Show Review For Last N Orders</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Only show review button for recent orders
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowResubmitOnRejected"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Allow Resubmit On Rejected</FormLabel>
                  <FormDescription>
                    User can resubmit if review was rejected
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Validation Rules</h3>
          <Separator />

          <FormField
            control={form.control}
            name="ratingRequired"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Rating Required</FormLabel>
                  <FormDescription>
                    User must provide a rating (1-5 stars)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minMessageLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Message Length</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Minimum characters</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxMessageLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Message Length</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Maximum characters</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
