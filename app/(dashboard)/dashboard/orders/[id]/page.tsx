import { getOrderById } from "@/server/actions/order.actions";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/features/admin/order-status-badge";
import { OrderStatusDialog } from "@/components/features/admin/order-status-dialog";
import { OrderAuditLog } from "@/components/features/admin/order-audit-log";
import { Money } from "@/components/shared/money";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { TestimonialRequestButton } from "@/components/features/admin/testimonial-request-button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h2>
          <p className="text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("id-ID", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm px-3 py-1" />
        <TestimonialRequestButton
          orderId={order.id}
          customerName={order.buyerName}
          customerPhone={order.buyerPhone}
        />
        <OrderStatusDialog orderId={order.id} currentStatus={order.status}>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> Update Status
          </Button>
        </OrderStatusDialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variantName} × {item.quantity}
                    </p>
                  </div>
                  <Money amount={item.lineTotal} className="font-medium" />
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <Money amount={order.subtotal} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Status History</h3>
            <OrderAuditLog logs={order.statusLogs} />
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Customer Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{order.buyerName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{order.buyerPhone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="font-medium">{order.buyerAddress}</dd>
              </div>
              {order.buyerNote && (
                <div>
                  <dt className="text-muted-foreground">Note</dt>
                  <dd className="font-medium">{order.buyerNote}</dd>
                </div>
              )}
            </dl>
          </div>

          {order.adminNote && (
            <div className="rounded-lg border p-6 bg-muted/30">
              <h3 className="font-semibold mb-2">Admin Note</h3>
              <p className="text-sm">{order.adminNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
