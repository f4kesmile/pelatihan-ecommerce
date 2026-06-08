import { DashboardLayout } from "@/components/features/admin/dashboard/dashboard-layout";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { getUserProfile } from "@/server/actions/user.actions";
import { getStoreConfig } from "@/server/actions/store.actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard | Zinc Store",
  description: "Admin Management Panel",
};

import { getAdminNotifications } from "@/server/actions/dashboard.actions";

// ...

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const user = await getUserProfile();
  const storeConfig = await getStoreConfig();
  const notifications = await getAdminNotifications();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/");
  }

  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;

  return (
    <DashboardLayout
      defaultOpen={defaultOpen}
      user={serializedUser}
      storeName={storeConfig?.storeName}
      storeLogo={storeConfig?.logoBase64}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}
