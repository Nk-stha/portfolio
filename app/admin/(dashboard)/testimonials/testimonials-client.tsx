"use client";

import { DataTable } from "@/components/admin/DataTable";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/client/auth-client";

interface Testimonial {
  _id: string;
  name: string;
  title: string;
  company: string;
  isActive: boolean;
  order: number;
}

export function TestimonialsClient({ initialData }: { initialData: Testimonial[] }) {
  const router = useRouter();

  const handleDelete = async (row: Testimonial) => {
    const res = await authenticatedFetch(`/api/testimonials/${row._id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete testimonial");
  };

  const columns = [
    { header: "Name", accessorKey: "name" as keyof Testimonial },
    { 
        header: "Company", 
        accessorKey: (row: Testimonial) => (
            <div>
                {row.company}
                <span className="text-gray-500 text-xs block">{row.title}</span>
            </div>
        )
    },
    {
      header: "Status",
      accessorKey: (row: Testimonial) => {
          return row.isActive ? (
              <span className="inline-flex items-center text-green-400 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" /> Active
              </span>
          ) : (
              <span className="inline-flex items-center text-gray-500 text-xs">
                  <XCircle className="h-3 w-3 mr-1" /> Inactive
              </span>
          );
      }
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={initialData}
      searchKey="name"
      newHref="/admin/testimonials/new"
      newLabel="Add Testimonial"
      onDelete={handleDelete}
      editHref={(row) => `/admin/testimonials/${row._id}`}
    />
  );
}
