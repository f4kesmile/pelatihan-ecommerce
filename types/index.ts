export interface UserProfile {
  id: string;
  supabaseUserId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
  avatarBase64?: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface PublicUserInfo {
  id: string;
  fullName: string;
  email: string;
  avatarBase64?: string | null;
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderWithRelations {
  id: string;
  total?: number;
  subtotal: number;
  status: string;
  createdAt: Date | string;
  user: PublicUserInfo;
}

export interface TestimonialWithUser {
  id: string;
  rating: number;
  message: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "HIDDEN"; 
  createdAt: Date | string;
  user: PublicUserInfo;
  order: {
    orderNumber: string;
    createdAt: Date | string;
    items: {
      id: string;
      productName: string;
      variantName: string | null;
      quantity: number;
      unitPrice: number;
      product: {
        images: string[];
      };
    }[];
  };
}

export interface StoreConfig {
  id: string;
  storeName: string;
  storeDescription: string | null;
  storeEmail: string | null;
  storePhone: string | null;
  whatsappNumber: string | null;
  storeAddress: string | null;
  termsAndConditions: string | null;
  privacyPolicy: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ChartData {
  name: string;
  total: number;
  [key: string]: string | number;
}

export interface AuthFormState {
  error?: string;
  success?: boolean;
  message?: string;
}

export interface FormActionState<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}
