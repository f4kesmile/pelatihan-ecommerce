"use client";

import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Money } from "@/components/shared/money";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getRecentSales,
  type TimeRange,
} from "@/server/actions/dashboard.actions";
import { Loader2 } from "lucide-react";

interface SaleOrder {
  id: string;
  subtotal: number;
  createdAt: Date | string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarBase64?: string | null;
  };
}

const TIME_OPTIONS: { label: string; value: TimeRange }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export function RecentSales() {
  const [range, setRange] = useState<TimeRange>("week");
  const [data, setData] = useState<SaleOrder[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getRecentSales(range);
      setData(result as SaleOrder[]);
    });
  }, [range]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={range} onValueChange={(v) => setRange(v as TimeRange)}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-h-[200px]">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="space-y-5">
          {data.length === 0 && !isPending ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sales in this period.
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
                <div className="ml-4 space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {order.user.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.user.email}
                  </p>
                </div>
                <div className="ml-4 font-medium text-sm shrink-0">
                  +<Money amount={order.subtotal} className="inline" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {data.length > 0 && (
        <p className="text-xs text-muted-foreground text-center border-t pt-3">
          {data.length} sale{data.length > 1 ? "s" : ""} in this period
        </p>
      )}
    </div>
  );
}
