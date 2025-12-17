"use client";

import { DataTable } from "@/components/admin/DataTable";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Message {
  _id: string;
  name: string;
  email: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export function MessagesClient({ initialData }: { initialData: Message[] }) {
  const router = useRouter();

  const handleDelete = async (row: Message) => {
    const res = await fetch(`/api/contact/${row._id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete message");
  };

  const columns = [
    { header: "Name", accessorKey: "name" as keyof Message },
    { header: "Email", accessorKey: "email" as keyof Message },
    {
      header: "Status",
      accessorKey: (row: Message) => {
          const status = row.status;
          let colorClass = "text-gray-500";
          if (status === "new") colorClass = "text-green-400 font-bold";
          if (status === "read") colorClass = "text-yellow-400";
          if (status === "replied") colorClass = "text-blue-400";
          
          return (
              <span className={`capitalize ${colorClass}`}>{status}</span>
          );
      }
    },
     {
      header: "Date",
      accessorKey: (row: Message) => {
          return <span className="text-gray-400 text-xs">{format(new Date(row.createdAt), "MMM d, yyyy")}</span>;
      }
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={initialData}
      searchKey="name"
      onDelete={handleDelete}
      editHref={(row) => `/admin/messages/${row._id}`} // Reusing edit button as "View"
    />
  );
}
