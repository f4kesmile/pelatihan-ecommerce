"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images.length) {
    return (
      <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No Images</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full overflow-hidden rounded-lg border bg-background relative">
        <Image
          src={selectedImage?.src || images[0].src}
          alt={selectedImage?.alt || "Product image"}
          className="object-contain"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-auto pb-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative aspect-square w-20 flex-none overflow-hidden rounded-md border bg-background transition-all hover:opacity-100",
                selectedImage?.id === image.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                className="object-cover"
                fill
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
