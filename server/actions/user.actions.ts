"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { UserProfileInput } from "@/server/schemas/user.schema";

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { supabaseUserId: user.id },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(data: UserProfileInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.userProfile.update({
      where: { supabaseUserId: user.id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        address: data.address,
        avatarBase64: data.avatarBase64,
        avatarMime: data.avatarMime,
        avatarSize: data.avatarSize,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("Error changing password:", error);
    return { error: (error as Error).message || "Failed to change password" };
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.userProfile.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarBase64: true,
        createdAt: true,
      },
    });
    return { success: true, users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const requesterProfile = await prisma.userProfile.findUnique({
      where: { supabaseUserId: currentUser.id },
    });

    if (!requesterProfile || (requesterProfile.role !== "ADMIN" && requesterProfile.role !== "SUPERADMIN")) {
      return { success: false, error: "Insufficient permissions" };
    }

    if (requesterProfile.id === userId) {
      return { success: false, error: "You cannot change your own role" };
    }

    const targetUser = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    if (targetUser.role === "SUPERADMIN" && requesterProfile.role !== "SUPERADMIN") {
      return { success: false, error: "Only Super Admin can modify another Super Admin" };
    }

    if (newRole === "SUPERADMIN" && requesterProfile.role !== "SUPERADMIN") {
      return { success: false, error: "Only Super Admin can promote users to Super Admin" };
    }

    await prisma.userProfile.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
