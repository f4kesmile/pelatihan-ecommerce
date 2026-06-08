"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  MoreHorizontal,
  Shield,
  User as UserIcon,
  Key,
  Phone,
  Calendar,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/server/actions/user.actions";
import { PermissionsDialog } from "./permissions-dialog";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarBase64: string | null;
  phone: string | null;
  createdAt: Date;
}

interface UsersListProps {
  initialUsers: User[];
  currentUser: User | null;
}

const ROLE_OPTIONS: { label: string; value: Role; icon: typeof Shield }[] = [
  { label: "User", value: "USER", icon: UserIcon },
  { label: "Admin", value: "ADMIN", icon: Shield },
  { label: "Super Admin", value: "SUPERADMIN", icon: Shield },
];

export function UsersList({ initialUsers, currentUser }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [permissionUser, setPermissionUser] = useState<User | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const handleManagePermissions = (user: User) => {
    setPermissionUser(user);
    setShowPermissionDialog(true);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setLoadingId(userId);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        );
        toast.success(`User role updated to ${newRole}`);
      } else {
        toast.error(res.error || "Failed to update role");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const getAvailableRoles = (targetUser: User): typeof ROLE_OPTIONS => {
    return ROLE_OPTIONS.filter((opt) => {
      if (opt.value === targetUser.role) return false;
      if (opt.value === "SUPERADMIN" && currentUser?.role !== "SUPERADMIN")
        return false;
      return true;
    });
  };

  const isCurrentUser = (user: User) => currentUser?.id === user.id;

  const RoleBadge = ({ role }: { role: Role }) => (
    <Badge
      variant={
        role === "ADMIN" || role === "SUPERADMIN" ? "default" : "secondary"
      }
      className={cn(
        "gap-1",
        role === "SUPERADMIN" &&
          "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent",
      )}
    >
      {role === "SUPERADMIN" ? (
        <Crown className="h-3 w-3 fill-current" />
      ) : role === "ADMIN" ? (
        <Shield className="h-3 w-3" />
      ) : (
        <UserIcon className="h-3 w-3" />
      )}
      {role === "SUPERADMIN" ? "Super Admin" : role}
    </Badge>
  );

  const YouBadge = () => (
    <Badge
      variant="outline"
      className="gap-1 border-primary/30 text-primary text-[10px] ml-2 h-5"
    >
      You
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="block lg:hidden space-y-4">
        {users.map((user) => (
          <Card
            key={user.id}
            className={cn(
              "overflow-hidden transition-all",
              isCurrentUser(user) ? "border-primary/50 shadow-md" : "",
            )}
          >
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarBase64 || undefined} />
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center">
                      <span className="font-semibold truncate">
                        {user.fullName}
                      </span>
                      {isCurrentUser(user) && <YouBadge />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <RoleBadge role={user.role} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted/30 p-2 rounded flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{user.phone || "-"}</span>
                </div>
                <div className="bg-muted/30 p-2 rounded flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
              </div>

              {currentUser && currentUser.id !== user.id && (
                <div className="flex justify-end gap-2 pt-2 border-t">
                  {currentUser.role === "SUPERADMIN" &&
                    user.role === "ADMIN" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManagePermissions(user)}
                      >
                        <Key className="h-3 w-3 mr-2" /> Permissions
                      </Button>
                    )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loadingId === user.id}
                      >
                        {loadingId === user.id ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        ) : (
                          <Shield className="h-3 w-3 mr-2" />
                        )}
                        Change Role
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getAvailableRoles(user).map((opt) => (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => handleRoleChange(user.id, opt.value)}
                        >
                          <opt.icon className="h-3 w-3 mr-2" />
                          Set as {opt.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden lg:block bg-card border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_80px] gap-4 px-6 py-3 text-sm font-medium text-muted-foreground select-none border-b bg-muted/20">
          <div>User</div>
          <div>Role</div>
          <div>Phone</div>
          <div>Joined</div>
          <div className="text-right">Actions</div>
        </div>

        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                "grid grid-cols-[2.5fr_1.5fr_1fr_1fr_80px] gap-4 items-center px-6 py-4 border-b last:border-0 hover:bg-muted/30 transition-colors",
                isCurrentUser(user) ? "bg-primary/5 hover:bg-primary/10" : "",
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={user.avatarBase64 || undefined} />
                  <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center">
                    <span className="font-semibold truncate text-sm">
                      {user.fullName}
                    </span>
                    {isCurrentUser(user) && <YouBadge />}
                  </div>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <div>
                <RoleBadge role={user.role} />
              </div>

              <div className="text-sm truncate text-muted-foreground">
                {user.phone ? (
                  <span className="font-mono text-foreground">
                    {user.phone}
                  </span>
                ) : (
                  <span className="italic opacity-50">-</span>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                })}
              </div>

              <div className="flex justify-end gap-1">
                {currentUser && currentUser.id !== user.id && (
                  <>
                    {currentUser.role === "SUPERADMIN" &&
                      user.role === "ADMIN" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Manage Permissions"
                          onClick={() => handleManagePermissions(user)}
                        >
                          <Key className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={loadingId === user.id}
                        >
                          {loadingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getAvailableRoles(user).map((opt) => (
                          <DropdownMenuItem
                            key={opt.value}
                            onClick={() => handleRoleChange(user.id, opt.value)}
                          >
                            <opt.icon className="h-3 w-3 mr-2" />
                            Set as {opt.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {permissionUser && (
        <PermissionsDialog
          user={permissionUser}
          open={showPermissionDialog}
          onOpenChange={setShowPermissionDialog}
        />
      )}
    </div>
  );
}
