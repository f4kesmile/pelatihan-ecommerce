"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  Trash,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import {
  toggleTestimonialStatus,
  deleteTestimonial,
  toggleTestimonialVisibility,
} from "@/server/actions/testimonial-admin.actions";

interface TestimonialTableProps {
  data: any[];
}

export function TestimonialTable({ data }: TestimonialTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    const result = await toggleTestimonialStatus(id, !currentStatus);
    setLoadingId(null);

    if (result.success) {
      toast.success(
        currentStatus
          ? "Testimonial hidden from public"
          : "Testimonial approved",
      );
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleVisibility = async (id: string, currentHidden: boolean) => {
    setLoadingId(id);
    const result = await toggleTestimonialVisibility(id, !currentHidden);
    setLoadingId(null);

    if (result.success) {
      toast.success(
        currentHidden
          ? "Testimonial is now visible"
          : "Testimonial is now hidden",
      );
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    setLoadingId(id);
    const result = await deleteTestimonial(id);
    setLoadingId(null);

    if (result.success) {
      toast.success("Testimonial deleted");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="w-[300px]">Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No testimonials found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.user.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{item.rating}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p
                    className="line-clamp-2 text-sm text-muted-foreground"
                    title={item.message}
                  >
                    {item.message}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {item.isApproved ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    {item.isHidden && (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground border-dashed"
                      >
                        Hidden
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={loadingId === item.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(item.id, item.isApproved)
                        }
                      >
                        {item.isApproved ? (
                          <>
                            <ShieldAlert className="mr-2 h-4 w-4" /> Reject
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="mr-2 h-4 w-4" /> Approve
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleVisibility(item.id, item.isHidden)
                        }
                      >
                        {item.isHidden ? (
                          <>
                            <Eye className="mr-2 h-4 w-4" /> Show
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" /> Hide
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
