import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Money } from "@/components/shared/money";
import { OrderWithRelations } from "@/types";

interface RecentSalesProps {
  data: OrderWithRelations[];
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No recent sales.
        </p>
      ) : (
        data.map((order) => (
          <div key={order.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={order.user.avatarBase64 || undefined}
                alt="Avatar"
              />
              <AvatarFallback>
                {order.user.fullName?.slice(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {order.user.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.user.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +<Money amount={order.subtotal} className="inline" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
