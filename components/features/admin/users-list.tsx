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
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  MoreHorizontal,
  Shield,
  User as UserIcon,
  Key,
} from "lucide-react";
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

interface UsersListProps {
  initialUsers: User[];
  currentUser: User | null;
}

export function UsersList({ initialUsers, currentUser }: UsersListProps) {
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
    <div className="space-y-6">
      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">No users found.</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarBase64 || undefined} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      user.role === "ADMIN" || user.role === "SUPERADMIN"
                        ? "default"
                        : "secondary"
                    }
                    className="gap-1 shrink-0"
                  >
                    {user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <UserIcon className="h-3 w-3" />
                    )}
                    {user.role === "SUPERADMIN" ? "S.Admin" : user.role}
                  </Badge>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>

                {canEditUser(user) && (
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    {/* Permission Button - Only for Super Admin */}
                    {currentUser?.role === "SUPERADMIN" &&
                      user.role !== "SUPERADMIN" && (
                        <Button
                          variant="outline"
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
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-xl border bg-card">
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
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
                        <UserIcon className="h-3 w-3" />
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
                            disabled={
                              loadingId === user.id || !canEditUser(user)
                            }
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
              ))
            )}
          </TableBody>
        </Table>
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
