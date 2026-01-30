"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const origin = (await headers()).get("origin");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Manually create UserProfile to ensure sync
  if (data?.user) {
    try {
      // const { db } = await import("@/lib/db/prisma"); 
      // or just import prisma global if available, but let's assume standard import
       const prisma = (await import("@/lib/db/prisma")).default;

      await prisma.userProfile.create({
        data: {
          id: data.user.id, // Keep IDs in sync for easy lookup
          supabaseUserId: data.user.id,
          email: email,
          fullName: fullName,
          role: "USER",
        },
      });
    } catch (err) {
      console.error("Failed to create user profile:", err);
      // Optional: Try to rollback auth user if profile creation fails? 
      // For now, let's just log it. The fix-sync script can handle stragglers.
    }
  }

  // If email confirmation is disabled in Supabase, the user is logged in immediately
  if (data?.session) {
    redirect("/");
  }

  return { success: true, message: "Check your email to confirm your account." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
