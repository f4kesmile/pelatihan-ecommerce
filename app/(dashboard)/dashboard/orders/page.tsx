import { getOrders } from "@/server/actions/order.actions";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrdersList } from "@/components/features/admin/orders/orders-list";

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const status = params.status as OrderStatus | undefined;
  const page = parseInt(params.page || "1", 10);

  const { orders, pagination } = await getOrders({ status, page, limit: 10 });

  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Orders
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Manage customer orders and update their status.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap overflow-x-auto pb-2 sm:pb-0">
        <Link href="/dashboard/orders">
          <Button variant={!status ? "default" : "outline"} size="sm">
            All
          </Button>
        </Link>
        {(
          [
            "PENDING",
            "CONFIRMED",
            "SHIPPING",
            "SUCCEEDED",
            "CANCELED",
          ] as OrderStatus[]
        ).map((s) => (
          <Link key={s} href={`/dashboard/orders?status=${s}`}>
            <Button variant={status === s ? "default" : "outline"} size="sm">
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </Button>
          </Link>
        ))}
      </div>

      <OrdersList orders={serializedOrders} />

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`/dashboard/orders?${status ? `status=${status}&` : ""}page=${p}`}
              >
                <Button variant={p === page ? "default" : "outline"} size="sm">
                  {p}
                </Button>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
