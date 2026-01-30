import { getUserOrders } from "@/server/actions/order.actions";
import { getReviewSettingsWithDefaults } from "@/server/actions/review-settings.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Money } from "@/components/shared/money";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrderReviewCTA } from "@/components/features/testimonial/order-review-cta";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: { label: "Pending", variant: "secondary", icon: Clock },
  CONFIRMED: { label: "Confirmed", variant: "default", icon: CheckCircle },
  PROCESSING: { label: "Processing", variant: "default", icon: Package },
  SHIPPED: { label: "Shipped", variant: "default", icon: Truck },
  DELIVERED: { label: "Delivered", variant: "default", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
};

export default async function OrdersPage() {
  const [{ orders, error }, settingsResult] = await Promise.all([
    getUserOrders(),
    getReviewSettingsWithDefaults(),
  ]);

  const settings = settingsResult.success ? settingsResult.data : null;

  if (error) {
    return (
      <div className="w-full px-4 md:px-6 lg:px-8 py-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-muted-foreground">
            Please login to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-muted-foreground mb-4">
                Start shopping to see your orders here.
              </p>
              <Link href="/products" className="text-primary hover:underline">
                Browse Products
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              return (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-medium">
                          Order #{order.orderNumber}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={config.variant}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden relative">
                            {item.product.images?.[0] ? (
                              <Image
                                src={item.product.images[0].base64}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {item.product.name}
                            </p>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">
                                {item.variant.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">
                              x{item.quantity}
                            </p>
                            <Money
                              amount={item.unitPrice * item.quantity}
                              className="font-medium"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total
                      </span>
                      <Money
                        amount={order.subtotal}
                        className="text-lg font-bold"
                      />
                    </div>

                    {settings &&
                      settings.reviewsEnabled &&
                      settings.myOrdersReviewEnabled && (
                        <OrderReviewCTA
                          orderId={order.id}
                          orderNumber={order.orderNumber}
                          orderStatus={order.status}
                          orderDate={order.createdAt}
                          testimonial={order.testimonial}
                          reviewWindowDays={settings.reviewWindowDays}
                          requireOrderSucceeded={settings.requireOrderSucceeded}
                          allowResubmitOnRejected={
                            settings.allowResubmitOnRejected
                          }
                        />
                      )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
