"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, ShoppingBag } from "lucide-react";
import { logout } from "@/server/actions/auth.actions";
import { SettingsDialog } from "@/components/features/user/settings-dialog";

interface UserNavProps {
  user: {
    email?: string;
    full_name?: string;
  };
  userProfile?: {
    fullName: string;
    phone?: string | null;
    city?: string | null;
    address?: string | null;
    avatarBase64?: string | null;
  } | null;
}

export function UserNav({ user, userProfile }: UserNavProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  const avatarSrc = userProfile?.avatarBase64;

  return (
    <>
      {userProfile && (
        <SettingsDialog
          user={userProfile}
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary/20 hover:border-primary transition-all shadow-md"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                {initials}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.full_name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userProfile && (
            <DropdownMenuItem
              onClick={() => setIsSettingsOpen(true)}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout()}
            className="text-red-500 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
