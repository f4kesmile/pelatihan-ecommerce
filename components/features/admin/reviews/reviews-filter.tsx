"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export function ReviewsFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const currentStatus = searchParams.get("status") || "ALL";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        defaultValue={currentStatus}
        value={currentStatus}
        onValueChange={handleStatusChange}
        className="w-full sm:w-auto"
      >
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          <TabsTrigger value="HIDDEN">Hidden</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews or users..."
          className="pl-8"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
