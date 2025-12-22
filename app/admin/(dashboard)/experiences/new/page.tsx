"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { authenticatedFetch } from "@/lib/client/auth-client";

export default function NewExperiencePage() {
  const fields = [
    { name: "company", label: "Company", type: "text" as const, required: true },
    { name: "role", label: "Role/Position", type: "text" as const, required: true },
    { name: "startDate", label: "Start Date", type: "date" as const, required: true },
    { name: "endDate", label: "End Date (leave empty for current)", type: "date" as const },
    { name: "description", label: "Description", type: "textarea" as const, required: true },
    { name: "companyLogo", label: "Company Logo URL", type: "image" as const },
    { name: "companyUrl", label: "Company Website", type: "text" as const },
    { name: "isPrimary", label: "Featured Experience", type: "checkbox" as const },
  ];

  const handleSubmit = async (data: any) => {
    const res = await authenticatedFetch("/api/experiences", {
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
