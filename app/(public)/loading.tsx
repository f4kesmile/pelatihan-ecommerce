import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Skeleton */}
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8 mt-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="h-12 w-3/4 max-w-2xl" />
          <Skeleton className="h-6 w-1/2 max-w-xl" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Popular Products Skeleton */}
      <section className="w-full px-4 md:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="space-y-8">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div className="flex gap-4 px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[300px] shrink-0">
                <Skeleton className="h-[200px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
