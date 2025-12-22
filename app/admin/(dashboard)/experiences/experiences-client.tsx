"use client";

import { DataTable } from "@/components/admin/DataTable";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/client/auth-client";

interface Experience {
  _id: string;
  title: string;
  company: string;
  period: string;
  order: number;
}

export function ExperiencesClient({ initialData }: { initialData: Experience[] }) {
  const router = useRouter();

  const handleDelete = async (row: Experience) => {
    const res = await authenticatedFetch(`/api/experiences/${row._id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete experience");
  };

  const columns = [
    { header: "Title", accessorKey: "title" as keyof Experience },
    { header: "Company", accessorKey: "company" as keyof Experience },
    { header: "Period", accessorKey: "period" as keyof Experience },
  ];

  return (
    <DataTable
      columns={columns}
      data={initialData}
      searchKey="title"
      newHref="/admin/experiences/new"
      newLabel="Add Experience"
      onDelete={handleDelete}
      editHref={(row) => `/admin/experiences/${row._id}`}
    />
  );
}
