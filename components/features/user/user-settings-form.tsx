"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userProfileSchema,
  UserProfileInput,
  validateAvatar,
} from "@/server/schemas/user.schema";
import { updateUserProfile } from "@/server/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserSettingsFormProps {
  initialData: {
    fullName: string;
    phone?: string | null;
    city?: string | null;
    address?: string | null;
    avatarBase64?: string | null;
    avatarMime?: string | null;
    avatarSize?: number | null;
  };
}

export function UserSettingsForm({ initialData }: UserSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarBase64 || null,
  );

  const form = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: initialData.fullName,
      phone: initialData.phone || "",
      city: initialData.city || "",
      address: initialData.address || "",
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatar(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
        form.setValue("avatarBase64", base64);
        form.setValue("avatarMime", file.type);
        form.setValue("avatarSize", file.size);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to process image");
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    form.setValue("avatarBase64", undefined);
    form.setValue("avatarMime", undefined);
    form.setValue("avatarSize", undefined);
  };

  const onSubmit = async (data: UserProfileInput) => {
    setLoading(true);
    try {
      const result = await updateUserProfile(data);
      if (result.error) throw new Error(result.error);

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="space-y-4">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-6">
            {avatarPreview ? (
              <div className="relative">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2">
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={clearAvatar}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleAvatarUpload}
                disabled={loading}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WebP. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input disabled={loading} type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea disabled={loading} {...field} />
              </FormControl>
              <FormDescription>
                This will be used as default shipping address during checkout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
