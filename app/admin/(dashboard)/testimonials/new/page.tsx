"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";

export default function NewTestimonialPage() {
  const fields = [
    { name: "author.name", label: "Author Name", type: "text" as const, required: true },
    { name: "author.role", label: "Job Title/Role", type: "text" as const, required: true },
    { name: "author.company", label: "Company", type: "text" as const, required: true },
    { name: "author.image", label: "Author Photo", type: "image" as const, required: true },
    { name: "quote", label: "Testimonial Quote", type: "textarea" as const, required: true },
    { name: "rating", label: "Rating (1-5)", type: "number" as const, required: true },
    { name: "isPrimary", label: "Featured Testimonial", type: "checkbox" as const },
    { name: "isActive", label: "Active", type: "checkbox" as const },
  ];

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
    };

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
