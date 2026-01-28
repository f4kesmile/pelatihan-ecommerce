import { OrderStatus } from "@prisma/client";
import { OrderStatusBadge } from "./order-status-badge";
import { ArrowRight } from "lucide-react";

interface StatusLogEntry {
  id: string;
  from: OrderStatus;
  to: OrderStatus;
  changedBy: string;
  note: string | null;
  createdAt: Date;
}

interface OrderAuditLogProps {
  logs: StatusLogEntry[];
}

export function OrderAuditLog({ logs }: OrderAuditLogProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No status changes recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <OrderStatusBadge status={log.from} />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <OrderStatusBadge status={log.to} />
            </div>
            {log.note && (
              <p className="text-sm text-muted-foreground">{log.note}</p>
            )}
            <p className="text-xs text-muted-foreground">
              by {log.changedBy} •{" "}
              {new Date(log.createdAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
