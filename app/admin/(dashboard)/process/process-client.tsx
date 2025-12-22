"use client";

import { DataTable } from "@/components/admin/DataTable";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/client/auth-client";
import { Icon } from "@/components/ui/Icon";

interface ProcessStep {
  _id: string;
  title: string;
  icon: string;
  order: number;
}

export function ProcessClient({ initialData }: { initialData: ProcessStep[] }) {
  const router = useRouter();

  const handleDelete = async (row: ProcessStep) => {
    const res = await authenticatedFetch(`/api/process/${row._id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete process step");
  };

  const columns = [
    { 
        header: "Icon", 
        accessorKey: (row: ProcessStep) => (
            <div className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 text-primary">
                <Icon name={row.icon} size={18} />
            </div>
        )
    },
    { header: "Title", accessorKey: "title" as keyof ProcessStep },
    { header: "Order", accessorKey: "order" as keyof ProcessStep },
  ];

  return (
    <DataTable
      columns={columns}
      data={initialData}
      searchKey="title"
      newHref="/admin/process/new"
      newLabel="Add Step"
      onDelete={handleDelete}
      editHref={(row) => `/admin/process/${row._id}`}
    />
  );
}
