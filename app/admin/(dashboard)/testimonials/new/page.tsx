"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";

export default function NewTestimonialPage() {
  const fields = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "title", label: "Job Title", type: "text" as const, required: true },
    { name: "company", label: "Company", type: "text" as const, required: true },
    { name: "content", label: "Testimonial (Markdown)", type: "markdown" as const, required: true },
    { name: "image", label: "Photo", type: "image" as const },
    { name: "isActive", label: "Active", type: "checkbox" as const },
  ];

  const handleSubmit = async (data: any) => {
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create testimonial");
  };

  return (
    <ResourceForm
      resourceName="Testimonial"
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/testimonials"
    />
  );
}
