"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";

export default function EditTestimonialForm({ initialData }: { initialData: any }) {
  const fields = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "title", label: "Job Title", type: "text" as const, required: true },
    { name: "company", label: "Company", type: "text" as const, required: true },
    { name: "content", label: "Testimonial (Markdown)", type: "markdown" as const, required: true },
    { name: "image", label: "Photo", type: "image" as const },
    { name: "isActive", label: "Active", type: "checkbox" as const },
    { name: "order", label: "Order", type: "number" as const },
  ];

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/testimonials/${initialData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update testimonial");
  };

  return (
    <ResourceForm
      resourceName="Testimonial"
      initialData={initialData}
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/testimonials"
    />
  );
}
