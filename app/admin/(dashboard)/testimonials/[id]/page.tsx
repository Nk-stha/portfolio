import { connectToDatabase } from "@/lib/db/mongoose";
import { Testimonial } from "@/lib/db/models";
import EditTestimonialForm from "./edit-form";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
    const { id } = await params;
  await connectToDatabase();
  const testimonial = await Testimonial.findById(id).lean();

  if (!testimonial) {
    notFound();
  }

  return <EditTestimonialForm initialData={JSON.parse(JSON.stringify(testimonial))} />;
}
