"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cropper from "react-easy-crop";
import {
  userProfileSchema,
  UserProfileInput,
} from "@/server/schemas/user.schema";
import {
  updateUserProfile,
  changePassword,
} from "@/server/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Loader2, Settings, Upload, Eye, EyeOff, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";

interface SettingsDialogProps {
  user: {
    fullName: string;
    phone?: string | null;
    city?: string | null;
    address?: string | null;
    avatarBase64?: string | null;
  };
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new (window.Image as { new (): HTMLImageElement })();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

export function SettingsDialog({
  user,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SettingsDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled && controlledOnOpenChange) {
        controlledOnOpenChange(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, controlledOnOpenChange],
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarBase64 || null,
  );
  const [showCropper, setShowCropper] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone || "",
      city: user.city || "",
      address: user.address || "",
    },
  });

  const passwordForm = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onCropComplete = useCallback(
    (
      croppedArea: unknown,
      croppedAreaPixels: {
        x: number;
        y: number;
        width: number;
        height: number;
      },
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setAvatarPreview(croppedImage);
      form.setValue("avatarBase64", croppedImage);
      setShowCropper(false);
      setImageSrc(null);
    } catch {
      toast.error("Failed to crop image");
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    form.setValue("avatarBase64", undefined);
  };

  const onSubmit = async (data: UserProfileInput) => {
    setLoading(true);
    try {
      const result = await updateUserProfile(data);
      if (result.error) throw new Error(result.error);

      toast.success("Profile updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordChangeInput) => {
    setLoading(true);
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (result.error) throw new Error(result.error);

      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Settings
          </DialogTitle>
          <DialogDescription>
            Manage your profile and security settings
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent
            value="profile"
            className="space-y-6 mt-4 min-h-[480px] animate-in fade-in-0 slide-in-from-left-2 duration-300"
          >
            {/* Avatar Section */}
            <div className="space-y-4 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    Profile Picture
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Personalize your account with a photo
                  </p>
                </div>
              </div>

              {showCropper && imageSrc ? (
                <div className="space-y-4 mt-4">
                  <div className="relative h-64 w-full bg-muted rounded-lg overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Zoom</Label>
                    <Slider
                      value={[zoom]}
                      min={1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => setZoom(value[0])}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCropper(false);
                        setImageSrc(null);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleCropConfirm}>
                      <Check className="mr-2 h-4 w-4" />
                      Apply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6 mt-4">
                  {/* Avatar Preview - Always show current avatar or initials */}
                  <div className="relative group">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-border bg-muted">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={clearAvatar}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="relative"
                        disabled={loading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileSelect}
                          disabled={loading}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          aria-label="Upload profile picture"
                        />
                      </Button>
                      {avatarPreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearAvatar}
                          className="text-muted-foreground"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or WebP • Max 2MB • Crop & zoom available
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>

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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent
            value="security"
            className="space-y-6 mt-4 min-h-[480px] animate-in fade-in-0 slide-in-from-right-2 duration-300"
          >
            <div>
              <h3 className="text-lg font-medium mb-2">Change Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your password to keep your account secure
              </p>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    disabled={loading}
                    {...passwordForm.register("currentPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    disabled={loading}
                    {...passwordForm.register("newPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={loading}
                    {...passwordForm.register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
