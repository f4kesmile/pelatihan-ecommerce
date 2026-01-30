"use client";

import { useTransition } from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Star,
  Trash,
  CheckCircle,
  XCircle,
  EyeOff,
} from "lucide-react";
import {
  updateTestimonialStatus,
  deleteTestimonial,
} from "@/server/actions/testimonial-admin.actions";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  rating: number;
  message: string;
  status: string;
  createdAt: Date;
  orderId: string;
  user?: {
    fullName: string;
    email: string;
    avatarBase64?: string | null;
  } | null;
  order: {
    orderNumber: string;
    items: { productName: string }[];
  };
}

interface ReviewsTableProps {
  data: Review[];
}

export function ReviewsTable({ data }: ReviewsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (
    id: string,
    status: "APPROVED" | "PENDING" | "REJECTED" | "HIDDEN",
  ) => {
    startTransition(async () => {
      const result = await updateTestimonialStatus(id, status);
      if (result.success) {
        toast.success(`Review ${status.toLowerCase()} successfully`);
      } else {
        toast.error("Failed to update review status");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast.success("Review deleted successfully");
      } else {
        toast.error("Failed to delete review");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            Rejected
          </Badge>
        );
      case "HIDDEN":
        return <Badge variant="secondary">Hidden</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="max-w-[300px]">Review</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.user?.avatarBase64 || undefined}
                      />
                      <AvatarFallback>
                        {review.user?.fullName?.slice(0, 2).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {review.user?.fullName || "Guest"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {review.user?.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/dashboard/orders/${review.orderId}`}
                      className="text-sm font-medium hover:underline text-primary"
                    >
                      #{review.order.orderNumber}
                    </Link>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {review.order.items[0]?.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300 fill-none"}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer group relative">
                        <p className="truncate text-sm pr-4 line-clamp-2">
                          {review.message}
                        </p>
                        {review.message.length > 50 && (
                          <span className="text-xs text-primary group-hover:underline">
                            Read more
                          </span>
                        )}
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating ? "fill-current" : "text-gray-300 fill-none"}`}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground text-sm">
                            • {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-base leading-relaxed bg-muted/30 p-4 rounded-md">
                          {review.message}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(review.id, "APPROVED")
                        }
                        disabled={isPending || review.status === "APPROVED"}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(review.id, "REJECTED")
                        }
                        disabled={isPending || review.status === "REJECTED"}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(review.id, "HIDDEN")}
                        disabled={isPending || review.status === "HIDDEN"}
                      >
                        <EyeOff className="mr-2 h-4 w-4 text-gray-500" />
                        Hide from Public
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(review.id)}
                        disabled={isPending}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
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
