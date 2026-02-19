"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ChevronDown,
  ChevronRight,
  Package,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Money } from "@/components/shared/money";

import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderStatus } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  lineTotal: number;
  product?: {
    images: { base64: string; mimeType: string }[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  status: OrderStatus;
  subtotal: number;
  createdAt: Date;
  items: OrderItem[];
  testimonial?: {
    id: string;
    status: string;
  } | null;
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (orderId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedRows.has(order.id);

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Info */}
                  <div
                    className="flex gap-4 p-4 cursor-pointer"
                    onClick={() => toggleRow(order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base font-mono flex items-center gap-1.5">
                            #{order.orderNumber}
                            {order.testimonial?.status === "APPROVED" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <BadgeCheck
                                      className="h-4 w-4 text-blue-500 fill-blue-100 dark:fill-blue-900/30 cursor-help"
                                      aria-label="Reviewed"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Order Reviewed by Customer</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </h3>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {order.buyerName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </div>
                        <OrderStatusBadge
                          status={order.status}
                          className="text-xs px-2 py-0.5"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="font-medium">
                          <Money amount={order.subtotal} />
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              aria-label={`View order #${order.orderNumber}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <button
                          className="flex items-center gap-1 text-sm text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(order.id);
                          }}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Hide items
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-4 w-4" />
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div className="border-t bg-muted/30 p-4 space-y-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Order Items
                      </div>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden relative shrink-0">
                              {item.product?.images?.[0] ? (
                                <Image
                                  src={`data:${item.product.images[0].mimeType};base64,${item.product.images[0].base64}`}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {item.productName}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {item.variantName} × {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="font-medium">
                            <Money amount={item.lineTotal} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedRows.has(order.id);

                return (
                  <React.Fragment key={order.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleRow(order.id)}
                    >
                      <TableCell>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        <div className="flex items-center gap-1.5">
                          {order.orderNumber}
                          {order.testimonial?.status === "APPROVED" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <BadgeCheck
                                    className="h-4 w-4 text-blue-500 fill-blue-100 dark:fill-blue-900/30 cursor-help"
                                    aria-label="Reviewed"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Order Reviewed by Customer</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground lg:hidden">
                          {order.items.length} items
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.buyerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.buyerPhone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Money amount={order.subtotal} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              aria-label={`View order #${order.orderNumber}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Items Row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={7} className="p-0">
                          <div className="px-14 py-4">
                            <div className="text-sm font-medium text-muted-foreground mb-3">
                              Order Details
                            </div>
                            <div className="grid gap-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden relative shrink-0">
                                      {item.product?.images?.[0] ? (
                                        <Image
                                          src={`data:${item.product.images[0].mimeType};base64,${item.product.images[0].base64}`}
                                          alt={item.productName}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <span className="font-medium">
                                      {item.productName}
                                    </span>
                                    <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                      {item.variantName}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      x{item.quantity}
                                    </span>
                                  </div>
                                  <div className="font-medium">
                                    <Money amount={item.lineTotal} />
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
