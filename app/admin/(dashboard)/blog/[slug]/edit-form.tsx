"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { authenticatedFetch } from "@/lib/client/auth-client";

export default function EditBlogForm({ post }: { post: any }) {
  const fields = [
    { name: "title", label: "Title", type: "text" as const, required: true },
    // Slug is typically immutable or handled carefully, but we can allow edit if API supports it (API blocks it currently)
    // API `app/api/blog/[slug]/route.ts`: "if (body.slug && body.slug !== params.slug) ... return error"
    // So we should probably remove slug from edit or make it read-only. 
    // For now, I'll remove it to avoid errors.
    { name: "excerpt", label: "Excerpt", type: "textarea" as const, required: true },
    { name: "content", label: "Content (Markdown)", type: "markdown" as const, required: true },
    { name: "category", label: "Category", type: "text" as const, required: true },
    { name: "featuredImage", label: "Featured Image URL", type: "image" as const, required: true },
    { name: "isFeatured", label: "Featured Post", type: "checkbox" as const },
    { name: "publishedAt", label: "Publish Date", type: "date" as const },
  ];
  
  // Format initial data date for input
  const initialData = {
      ...post,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : ''
  };

  const handleSubmit = async (data: any) => {
    const payload = {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString()
    };
    
    // Remove immutable fields if present
    delete payload.slug;
    delete payload._id;

    const res = await authenticatedFetch(`/api/blog/${post.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update post");
  };

  return (
    <ResourceForm
      resourceName="Blog Post"
      initialData={initialData}
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/blog"
    />
  );
}
