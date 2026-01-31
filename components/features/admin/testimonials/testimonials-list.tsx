"use client";

import { useState } from "react";
import * as React from "react";
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
import { Card, CardContent } from "@/components/ui/card";
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
  Quote,
  ChevronDown,
  ChevronRight,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateTestimonialStatus,
  deleteTestimonial,
} from "@/server/actions/testimonial-admin.actions";
import { TestimonialWithUser } from "@/types";

interface TestimonialsListProps {
  data: TestimonialWithUser[];
}

export function TestimonialsList({ data }: TestimonialsListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id);
    const newStatus = currentStatus === "APPROVED" ? "PENDING" : "APPROVED";
    const result = await updateTestimonialStatus(id, newStatus);
    setLoadingId(null);

    if (result.success) {
      toast.success(
        newStatus === "APPROVED"
          ? "Testimonial approved"
          : "Testimonial reverted to pending",
      );
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: string) => {
    setLoadingId(id);
    const newStatus = currentStatus === "HIDDEN" ? "APPROVED" : "HIDDEN";
    const result = await updateTestimonialStatus(id, newStatus);
    setLoadingId(null);

    if (result.success) {
      toast.success(
        newStatus === "HIDDEN"
          ? "Testimonial is now hidden"
          : "Testimonial is now visible",
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
    <div className="space-y-6">
      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-4">
        {data.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">No testimonials yet.</p>
            </CardContent>
          </Card>
        ) : (
          data.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {item.user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{item.user.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.status === "APPROVED" ? (
                      <span className="text-xs bg-green-500/15 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                        Approved
                      </span>
                    ) : item.status === "PENDING" ? (
                      <span className="text-xs bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                        Pending
                      </span>
                    ) : item.status === "REJECTED" ? (
                      <span className="text-xs bg-red-500/15 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                        Rejected
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-500/15 text-gray-700 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg flex gap-3">
                  <Quote className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < item.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      &quot;{item.message}&quot;
                    </p>
                  </div>
                </div>

                {/* Mobile Expandable Order Details */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between h-auto py-2 px-0 hover:bg-transparent"
                    onClick={() => toggleRow(item.id)}
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      Order #{item.order.orderNumber}
                    </span>
                    {expandedRows.has(item.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  {expandedRows.has(item.id) && (
                    <div className="mt-2 border rounded-md bg-background overflow-hidden">
                      <div className="p-2 bg-muted/30 border-b text-xs text-muted-foreground">
                        Ordered on{" "}
                        {new Date(item.order.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </div>
                      <div className="divide-y">
                        {item.order.items.map((orderItem) => (
                          <div
                            key={orderItem.id}
                            className="flex items-start gap-3 p-3"
                          >
                            <div className="h-10 w-10 flex-shrink-0 bg-muted rounded overflow-hidden relative">
                              <Package className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">
                                {orderItem.productName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {orderItem.variantName}
                              </p>
                            </div>
                            <div className="text-right text-xs">
                              <p className="font-medium">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(orderItem.unitPrice)}
                              </p>
                              <p className="text-muted-foreground">
                                x{orderItem.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loadingId === item.id}
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className={
                      item.status === "APPROVED"
                        ? "text-destructive"
                        : "text-green-600"
                    }
                  >
                    {item.status === "APPROVED" ? (
                      <>
                        <ShieldAlert className="h-4 w-4 mr-2" /> Reject
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Approve
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleVisibility(item.id, item.status)
                        }
                      >
                        {item.status === "HIDDEN" ? (
                          <>
                            <Eye className="mr-2 h-4 w-4" /> Show Publicly
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" /> Hide Publicly
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
                </div>
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
              <TableHead className="w-[50px]"></TableHead>
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
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No testimonials found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                return (
                  <React.Fragment key={item.id}>
                    <TableRow className={isExpanded ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleRow(item.id)}
                          aria-label={
                            isExpanded
                              ? "Collapse order details"
                              : "Expand order details"
                          }
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.user.fullName}
                          </span>
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
                          {item.status === "APPROVED" && (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              Approved
                            </Badge>
                          )}
                          {item.status === "PENDING" && (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                          {item.status === "REJECTED" && (
                            <Badge variant="destructive">Rejected</Badge>
                          )}
                          {item.status === "HIDDEN" && (
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
                                handleToggleStatus(item.id, item.status)
                              }
                            >
                              {item.status === "APPROVED" ? (
                                <>
                                  <ShieldAlert className="mr-2 h-4 w-4" />{" "}
                                  Reject
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                  Approve
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleVisibility(item.id, item.status)
                              }
                            >
                              {item.status === "HIDDEN" ? (
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
                    {isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={7} className="p-0">
                          <div className="px-4 py-4 sm:px-14">
                            <div className="mb-3 flex items-center justify-between">
                              <h4 className="font-semibold text-sm">
                                Order Details (#{item.order.orderNumber})
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                Ordered on{" "}
                                {new Date(
                                  item.order.createdAt,
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="border rounded-md bg-background overflow-hidden">
                              {item.order.items.map((orderItem, idx) => (
                                <div
                                  key={orderItem.id}
                                  className={`flex items-start gap-3 p-3 ${
                                    idx !== item.order.items.length - 1
                                      ? "border-b"
                                      : ""
                                  }`}
                                >
                                  <div className="h-10 w-10 flex-shrink-0 bg-muted rounded overflow-hidden relative">
                                    <Package className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">
                                      {orderItem.productName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {orderItem.variantName}
                                    </p>
                                  </div>
                                  <div className="text-right text-xs">
                                    <p className="font-medium">
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }).format(orderItem.unitPrice)}
                                    </p>
                                    <p className="text-muted-foreground">
                                      x{orderItem.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
