import { Metadata } from "next";
import { getAllTestimonials } from "@/server/actions/testimonial-admin.actions";
import { TestimonialsList } from "@/components/features/admin/testimonials-list";

export const metadata: Metadata = {
  title: "Testimonials | Dashboard",
  description: "Manage customer testimonials",
};

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();

  // Serialize dates to avoid warnings/error passing to Client Component
  const serializedTestimonials = JSON.parse(JSON.stringify(testimonials));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer reviews and approvals.
          </p>
        </div>
      </div>

      <TestimonialsList data={serializedTestimonials} />
    </div>
  );
}
