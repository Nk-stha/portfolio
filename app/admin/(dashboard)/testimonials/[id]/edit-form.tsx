"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { authenticatedFetch } from "@/lib/client/auth-client";

export default function EditTestimonialForm({ initialData }: { initialData: any }) {
  const fields = [
    { name: "author.name", label: "Author Name", type: "text" as const, required: true },
    { name: "author.role", label: "Job Title/Role", type: "text" as const, required: true },
    { name: "author.company", label: "Company", type: "text" as const, required: true },
    { name: "author.image", label: "Author Photo", type: "image" as const, required: true },
    { name: "quote", label: "Testimonial Quote", type: "textarea" as const, required: true },
    { name: "rating", label: "Rating (1-5)", type: "number" as const, required: true },
    { name: "isPrimary", label: "Featured Testimonial", type: "checkbox" as const },
    { name: "isActive", label: "Active", type: "checkbox" as const },
    { name: "order", label: "Order", type: "number" as const },
  ];

  // Flatten the author object for form display
  const flattenedData = {
    ...initialData,
    "author.name": initialData.author?.name || "",
    "author.role": initialData.author?.role || "",
    "author.company": initialData.author?.company || "",
    "author.image": initialData.author?.image || "",
  };

  const handleSubmit = async (data: any) => {
    // Restructure nested author data
    const payload = {
      author: {
        name: data["author.name"],
        role: data["author.role"],
        company: data["author.company"],
        image: data["author.image"],
      },
      quote: data.quote,
      rating: data.rating,
      isPrimary: data.isPrimary,
      isActive: data.isActive,
      order: data.order,
    };

    const res = await authenticatedFetch(`/api/testimonials/${initialData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update testimonial");
  };

  return (
    <ResourceForm
      resourceName="Testimonial"
      initialData={flattenedData}
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/testimonials"
    />
  );
}
