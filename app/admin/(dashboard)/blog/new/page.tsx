"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { authenticatedFetch } from "@/lib/client/auth-client";

export default function NewBlogPostPage() {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    { name: "slug", label: "Slug", type: "text" as const, required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea" as const, required: true },
    { name: "content", label: "Content (Markdown)", type: "markdown" as const, required: true },
    { name: "category", label: "Category", type: "text" as const, required: true },
    { name: "featuredImage", label: "Featured Image URL", type: "image" as const, required: true },
    { name: "publishedAt", label: "Publish Date", type: "date" as const },
  ];

  const handleSubmit = async (data: any) => {
    // Generate valid JSON Date for publishedAt if present, or default to now
    const payload = {
        ...data,
         // Default to now if not set, or keep the date
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString()
    };

    const res = await authenticatedFetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create post");
  };

  return (
    <ResourceForm
      resourceName="Blog Post"
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/blog"
    />
  );
}
