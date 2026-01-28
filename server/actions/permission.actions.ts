"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getUserPermissions(userId: string) {
  try {
    const permissions = await prisma.adminPermission.findMany({
      where: { userId },
      select: { key: true },
    });
    return { success: true, permissions: permissions.map(p => p.key) };
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
    return { success: false, error: "Failed to fetch permissions" };
  }
}

export async function updateUserPermissions(userId: string, permissionKeys: string[]) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if requester is SUPERADMIN
    const requesterProfile = await prisma.userProfile.findUnique({
      where: { supabaseUserId: currentUser.id },
    });

    if (requesterProfile?.role !== "SUPERADMIN") {
      return { success: false, error: "Only Super Admin can manage permissions" };
    }

    // Transaction to replace permissions
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing permissions for user
      await tx.adminPermission.deleteMany({
        where: { userId },
      });

      // 2. Create new permissions
      if (permissionKeys.length > 0) {
        await tx.adminPermission.createMany({
          data: permissionKeys.map((key) => ({
            userId,
            key,
          })),
        });
      }
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update permissions:", error);
    return { success: false, error: "Failed to update permissions" };
  }
}
