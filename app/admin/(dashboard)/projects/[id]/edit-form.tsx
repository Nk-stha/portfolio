"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { authenticatedFetch } from "@/lib/client/auth-client";

export default function EditProjectForm({ project }: { project: any }) {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "description", label: "Description", type: "markdown" as const, required: true },
    { name: "category", label: "Category", type: "text" as const, required: true },
    { name: "image", label: "Image URL", type: "image" as const, required: true },
    { name: "link", label: "Project Link", type: "text" as const },
    { name: "githubLink", label: "GitHub Link", type: "text" as const },
    { name: "technologies", label: "Technologies (Comma separated)", type: "text" as const, required: true },
    { name: "order", label: "Sort Order", type: "number" as const, required: true },
    { name: "isFeatured", label: "Featured Project", type: "checkbox" as const },
  ];

  // Format initial data
  const initialData = {
      ...project,
      technologies: project.technologies?.join(", ") || ""
  };

  const handleSubmit = async (data: any) => {
    const payload = {
        ...data,
        technologies: data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
    };
    
    delete payload._id;

    const res = await authenticatedFetch(`/api/projects/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update project");
  };

  return (
    <ResourceForm
      resourceName="Project"
      initialData={initialData}
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/projects"
    />
  );
}
