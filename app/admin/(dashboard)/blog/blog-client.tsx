"use client";

import { DataTable } from "@/components/admin/DataTable";
import { format } from "date-fns";

interface AdminBlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
}

export function BlogClient({ posts }: { posts: AdminBlogPost[] }) {
  const columns = [
    { header: "Title", accessorKey: "title" as keyof AdminBlogPost, className: "text-white font-medium" },
    { header: "Category", accessorKey: "category", className: "text-gray-400 capitalize" },
    { 
      header: "Status", 
      accessorKey: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs ${
           new Date(row.publishedAt) > new Date() ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {new Date(row.publishedAt) > new Date() ? 'Scheduled' : 'Published'}
        </span>
      )
    },
    { 
      header: "Date", 
      accessorKey: (row: any) => format(new Date(row.publishedAt), "MMM d, yyyy"),
      className: "text-gray-400"
    },
  ];

  return (
    <DataTable<AdminBlogPost>
        data={posts} 
        columns={columns as any} 
        searchKey="title"
        newLabel="Create Post"
        newHref="/admin/blog/new"
        editHref={(row) => `/admin/blog/${row.slug}`} 
    />
  );
}
