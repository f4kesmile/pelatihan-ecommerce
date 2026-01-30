import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBase64Image(base64String: string | null | undefined): string {
  if (!base64String) return "";
  
  if (base64String.startsWith("data:image")) {
    return base64String;
  }

  return `data:image/png;base64,${base64String}`;
}
