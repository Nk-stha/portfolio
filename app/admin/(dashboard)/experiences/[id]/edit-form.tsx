"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";

export default function EditExperienceForm({ initialData }: { initialData: any }) {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "company", label: "Company", type: "text" as const, required: true },
    { name: "location", label: "Location", type: "text" as const, required: true },
    { name: "period", label: "Period", type: "text" as const, required: true },
    { name: "description", label: "Description (Markdown)", type: "markdown" as const, required: true },
    { name: "order", label: "Order", type: "number" as const },
  ];

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/experiences/${initialData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update experience");
  };

  return (
    <ResourceForm
      resourceName="Experience"
      initialData={initialData}
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/experiences"
    />
  );
}
