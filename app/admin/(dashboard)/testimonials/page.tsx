import { connectToDatabase } from "@/lib/db/mongoose";
import { Testimonial } from "@/lib/db/models";
import { TestimonialsClient } from "./testimonials-client";

export const dynamic = "force-dynamic";

async function getTestimonials() {
  await connectToDatabase();
  // Get all including inactive, but not deleted
  const testimonials = await Testimonial.find({ deletedAt: null }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(testimonials));
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Testimonials</h2>
          <p className="text-muted-foreground">
            Manage client testimonials here.
          </p>
        </div>
      </div>
      <TestimonialsClient initialData={testimonials} />
    </div>
  );
}
