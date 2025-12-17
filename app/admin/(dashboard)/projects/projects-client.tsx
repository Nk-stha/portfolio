"use client";

import { DataTable } from "@/components/admin/DataTable";

interface AdminProject {
  _id: string;
  title: string;
  slug?: string;
  category: string;
  isFeatured: boolean;
  order: number;
}

export function ProjectsClient({ projects }: { projects: AdminProject[] }) {
  const columns = [
    { header: "Title", accessorKey: "title" as keyof AdminProject, className: "text-white font-medium" },
    { header: "Category", accessorKey: "category", className: "text-gray-400 capitalize" },
    { 
      header: "Status", 
      accessorKey: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs ${
           row.isFeatured ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-500/10 text-gray-400'
        }`}>
          {row.isFeatured ? 'Featured' : 'Standard'}
        </span>
      )
    },
    { header: "Order", accessorKey: "order", className: "text-gray-400" },
  ];

  return (
    <DataTable<AdminProject>
        data={projects} 
        columns={columns as any} 
        searchKey="title"
        newLabel="New Project"
        newHref="/admin/projects/new"
        editHref={(row) => `/admin/projects/${row._id}`} 
    />
  );
}
