"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";

export default function NewProjectPage() {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "description", label: "Description", type: "textarea" as const, required: true },
    { name: "category", label: "Category", type: "text" as const, required: true },
    { name: "image", label: "Image URL", type: "image" as const, required: true },
    { name: "link", label: "Project Link", type: "text" as const },
    { name: "githubLink", label: "GitHub Link", type: "text" as const },
    { name: "technologies", label: "Technologies (Comma separated)", type: "text" as const, required: true },
    { name: "isFeatured", label: "Featured Project", type: "checkbox" as const },
  ];

  const handleSubmit = async (data: any) => {
    // Convert tech string to array
    const payload = {
        ...data,
        technologies: data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create project");
  };

  return (
    <ResourceForm
      resourceName="Project"
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/projects"
    />
  );
}
