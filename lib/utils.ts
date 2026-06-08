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

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
