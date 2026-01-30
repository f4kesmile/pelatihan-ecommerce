import { getTestimonials } from "@/server/actions/testimonial.actions";
import { ReviewsTable } from "@/components/features/admin/reviews-table";
import { ReviewsFilter } from "@/components/features/admin/reviews-filter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ReviewsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;

  const { success, testimonials, pagination } = await getTestimonials({
    page,
    limit,
    status: params.status,
    search: params.search,
  });

  if (!success) {
    return <div>Failed to load reviews.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">
            Manage customer testimonials and moderation queue.
          </p>
        </div>
      </div>

      <ReviewsFilter />

      <ReviewsTable data={testimonials || []} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4 items-center">
          <Link
            href={`/dashboard/reviews?${new URLSearchParams({
              ...params,
              page: String(page > 1 ? page - 1 : 1),
            }).toString()}`}
          >
            <Button variant="outline" size="sm" disabled={page <= 1}>
              Previous
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Link
            href={`/dashboard/reviews?${new URLSearchParams({
              ...params, // preserve other params
              page: String(
                page < pagination.totalPages ? page + 1 : pagination.totalPages,
              ),
            }).toString()}`}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
            >
              Next
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
