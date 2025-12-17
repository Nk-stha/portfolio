"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";

export default function NewExperiencePage() {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "company", label: "Company", type: "text" as const, required: true },
    { name: "location", label: "Location", type: "text" as const, required: true },
    { name: "period", label: "Period", type: "text" as const, required: true },
    { name: "description", label: "Description (Markdown)", type: "markdown" as const, required: true },
  ];

  const handleSubmit = async (data: any) => {
    const res = await fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create experience");
  };

  return (
    <ResourceForm
      resourceName="Experience"
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/experiences"
    />
  );
}
