"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  getUserPermissions,
  updateUserPermissions,
} from "@/server/actions/permission.actions";

interface PermissionsDialogProps {
  user: {
    id: string;
    fullName: string;
    role: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_PERMISSIONS = [
  { key: "manage_dashboard", label: "Access Dashboard (View)" },
  { key: "manage_products", label: "Manage Products (Create/Edit/Delete)" },
  { key: "manage_orders", label: "Manage Orders (Status Updates)" },
  { key: "manage_users", label: "Manage Users (View Only)" },
  { key: "manage_settings", label: "Manage Store Settings" },
];

export function PermissionsDialog({
  user,
  open,
  onOpenChange,
}: PermissionsDialogProps) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const res = await getUserPermissions(user.id);
        if (res.success && res.permissions) {
          setPermissions(res.permissions);
        }
      } catch {
        toast.error("Failed to load permissions");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadPermissions();
    }
  }, [open, user.id]);

  const handleToggle = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateUserPermissions(user.id, permissions);
      if (res.success) {
        toast.success("Permissions updated successfully");
        onOpenChange(false);
      } else {
        toast.error(res.error || "Failed to update permissions");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Manage Access Rights
          </DialogTitle>
          <DialogDescription>
            Configure granular permissions for{" "}
            <span className="font-medium text-foreground">{user.fullName}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                >
                  <Checkbox
                    id={perm.key}
                    checked={permissions.includes(perm.key)}
                    onCheckedChange={() => handleToggle(perm.key)}
                    aria-label={perm.label}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={perm.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Key: {perm.key}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
