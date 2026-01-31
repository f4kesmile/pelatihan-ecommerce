"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import {
  productFormSchema,
  ProductFormValues,
} from "@/server/schemas/product.schema";
import { createProduct, updateProduct } from "@/server/actions/product.actions";
import { createCategory } from "@/server/actions/category.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Plus, Trash2, X, ImagePlus, FolderPlus } from "lucide-react";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageCropper } from "@/components/shared/image-cropper";

interface ProductFormProps {
  initialData?: ProductFormValues & { id: string };
  categories: { id: string; name: string }[];
}

export function ProductForm({
  initialData,
  categories: initialCategories,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      categoryId: categories[0]?.id || "",
      isActive: true,
      isPopular: false,
      images: [],
      variants: [{ name: "Standard", price: 0, stock: 0, isActive: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const generateSlug = useDebouncedCallback((name: string) => {
    if (!initialData) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, 500);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setCreatingCategory(true);
    try {
      const result = await createCategory(newCategoryName);
      if (result.error) {
        toast.error(result.error);
      } else if (result.category) {
        toast.success("Category created!");
        setCategories([...categories, result.category]);
        form.setValue("categoryId", result.category.id);
        setNewCategoryName("");
        setCategoryDialogOpen(false);
      }
    } catch {
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Process one file at a time for cropping

    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Image ${file.name} is too large (max 5MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCurrentImageSrc(event.target.result as string);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const onCropComplete = (croppedBase64: string) => {
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];

    const [prefix, base64Data] = croppedBase64.split(",");
    const mimeType = prefix.match(/:(.*?);/)?.[1] || "image/jpeg";

    const approximateSize = Math.ceil((base64Data.length * 3) / 4);

    newImages.push({
      name: `image-${Date.now()}.jpg`, // Generate a name
      mimeType,
      base64: base64Data,
      size: approximateSize,
    });

    form.setValue("images", newImages, { shouldValidate: true });
    setCropperOpen(false);
    toast.success("Image added successfully");
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        const res = await updateProduct(initialData.id, data);
        if (res.error) throw new Error(res.error);
        toast.success("Product updated successfully");
      } else {
        const res = await createProduct(data);
        if (res.error) throw new Error(res.error);
        toast.success("Product created successfully");
      }
      router.refresh();
      router.push("/dashboard/products");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="basic" className="text-base">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="variants" className="text-base">
              Variants
            </TabsTrigger>
            <TabsTrigger value="images" className="text-base">
              Images
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BASIC INFO */}
          <TabsContent value="basic" className="mt-6">
            <div className="space-y-6 rounded-xl border p-6 bg-card">
              <h3 className="font-semibold text-xl">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Product Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="e.g. Zinc Premium Hoodie"
                        className="h-12 text-base"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          generateSlug(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="zinc-premium-hoodie"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique URL identifier for this product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category with Add New Button */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Category</FormLabel>
                    <div className="flex gap-3">
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 text-base flex-1">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id}
                              className="text-base"
                            >
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Dialog
                        open={categoryDialogOpen}
                        onOpenChange={setCategoryDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 px-4"
                          >
                            <FolderPlus className="h-5 w-5 mr-2" />
                            Add New
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                              Add a new product category to organize your
                              products.
                            </DialogDescription>
                          </DialogHeader>
                          <Input
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="h-12 text-base"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateCategory();
                              }
                            }}
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCategoryDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCreateCategory}
                              disabled={creatingCategory}
                            >
                              {creatingCategory && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Create
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm flex-1">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Product will be visible in the store.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm flex-1">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Popular Product
                        </FormLabel>
                        <FormDescription>
                          Show in &quot;Popular Products&quot; section.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Product description... (supports Enter for new lines)"
                        className="min-h-[150px] text-base resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Supports multiple lines. Press Enter for new line, use
                      &quot;1.&quot; for numbering.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* TAB 2: VARIANTS */}
          <TabsContent value="variants" className="mt-6">
            <div className="space-y-6 rounded-xl border p-6 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl">Product Variants</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add different sizes, colors, or options for this product.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    append({ name: "", price: 0, stock: 0, isActive: true })
                  }
                >
                  <Plus className="mr-2 h-5 w-5" /> Add Variant
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border p-4 bg-muted/30 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-muted-foreground">
                        Variant #{index + 1}
                      </span>
                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.isActive`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormLabel className="text-sm">Active</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={loading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant Name</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder="e.g. Size L / Blue"
                                className="h-12 text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (Rp)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={loading}
                                placeholder="0"
                                className="h-12 text-base"
                                {...field}
                                value={field.value as number}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={loading}
                                placeholder="0"
                                className="h-12 text-base"
                                {...field}
                                value={field.value as number}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {form.formState.errors.variants && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.variants.root?.message}
                </p>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: IMAGES */}
          <TabsContent value="images" className="mt-6">
            <div className="space-y-6 rounded-xl border p-6 bg-card">
              <div>
                <h3 className="font-semibold text-xl">Product Images</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload 1 or more images. Images will be cropped to 1:1 aspect
                  ratio. Max 2MB each. First image is the main display image.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.watch("images")?.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Image
                      src={`data:${image.mimeType};base64,${image.base64}`}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs text-center py-1.5 font-medium">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 hover:bg-muted transition-colors">
                  <ImagePlus className="h-10 w-10 text-muted-foreground mb-3" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Upload Image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Max 5MB (Before Crop)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={loading}
                  />
                </label>
              </div>

              {form.formState.errors.images && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>

      {/* Image Cropper Modal */}
      <ImageCropper
        imageSrc={currentImageSrc}
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        onCropComplete={onCropComplete}
        aspect={1} // 1:1 Aspect Ratio
      />
    </Form>
  );
}
