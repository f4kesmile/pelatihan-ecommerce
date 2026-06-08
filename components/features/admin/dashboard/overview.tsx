"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getChartData,
  type TimeRange,
} from "@/server/actions/dashboard.actions";
import { Loader2 } from "lucide-react";

const TIME_OPTIONS: { label: string; value: TimeRange }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const chartConfig = {
  total: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function formatRupiah(value: number): string {
  return `Rp.${value.toLocaleString("id-ID")}`;
}

function computeYTicks(data: { total: number }[]): {
  domain: [number, number];
  ticks: number[];
} {
  const maxVal = Math.max(...data.map((d) => d.total), 0);
  if (maxVal === 0)
    return { domain: [0, 100_000], ticks: [0, 50_000, 100_000] };

  let step: number;
  if (maxVal <= 500_000) step = 100_000;
  else if (maxVal <= 2_000_000) step = 500_000;
  else if (maxVal <= 5_000_000) step = 1_000_000;
  else if (maxVal <= 20_000_000) step = 5_000_000;
  else step = 10_000_000;

  const ceiling = Math.ceil(maxVal / step) * step;
  const ticks: number[] = [];
  for (let i = 0; i <= ceiling; i += step) {
    ticks.push(i);
  }
  return { domain: [0, ceiling], ticks };
}

export function Overview() {
  const [range, setRange] = useState<TimeRange>("month");
  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getChartData(range);
      setData(result);
    });
  }, [range]);

  const yAxis = useMemo(() => computeYTicks(data), [data]);

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

      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatRupiah}
              domain={yAxis.domain}
              ticks={yAxis.ticks}
              width={90}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) => value}
                  formatter={(value) => formatRupiah(Number(value))}
                />
              }
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
