"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal, Shield, User, Key } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/server/actions/user.actions";
import { PermissionsDialog } from "@/components/features/admin/permissions-dialog";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarBase64: string | null;
  createdAt: Date;
}

interface UsersTableProps {
  initialUsers: User[];
  currentUser: User | null;
}

export function UsersTable({ initialUsers, currentUser }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Permission Dialog State
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
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const canEditUser = (targetUser: User) => {
    if (!currentUser) return false;
    // Cannot edit self
    if (currentUser.id === targetUser.id) return false;
    // Only Super Admin can edit Super Admin
    if (targetUser.role === "SUPERADMIN" && currentUser.role !== "SUPERADMIN")
      return false;
    // Admin can only edit Users
    return true;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarBase64 || undefined} />
                  <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.role === "ADMIN" || user.role === "SUPERADMIN"
                      ? "default"
                      : "secondary"
                  }
                  className="gap-1"
                >
                  {user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* Permission Button - Only for Super Admin */}
                  {currentUser?.role === "SUPERADMIN" &&
                    user.role !== "SUPERADMIN" && (
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
                        disabled={loadingId === user.id || !canEditUser(user)}
                      >
                        {loadingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "USER")}
                      >
                        Set as User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "ADMIN")}
                      >
                        Set as Admin
                      </DropdownMenuItem>
                      {/* Only prevent showing SUPERADMIN option if not superadmin, though server checks too */}
                      {currentUser?.role === "SUPERADMIN" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, "SUPERADMIN")
                          }
                        >
                          Set as Super Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
