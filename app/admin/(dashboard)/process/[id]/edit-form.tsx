"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { useRouter } from "next/navigation";

interface ProcessStep {
  _id: string;
  title: string;
  icon: string;
  description: string;
  items: string[];
  order: number;
}

export function EditProcessForm({ initialData }: { initialData: ProcessStep }) {
  const router = useRouter();

  const handleUpdate = async (data: any) => {
    // Transform items from string (newline separated) to array
    const formattedData = {
      ...data,
      items: data.items.split('\n').filter((item: string) => item.trim() !== '')
    };

    const res = await fetch(`/api/process/${initialData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (!res.ok) throw new Error("Failed to update process step");

    router.push("/admin/process");
    router.refresh();
  };

  // Transform initialData.items (array) to string (textarea)
  const initialValues = {
    ...initialData,
    items: initialData.items.join('\n')
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ResourceForm
        resourceName="Process Step"
        backHref="/admin/process"
        initialData={initialValues}
        onSubmit={handleUpdate}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "icon", label: "Icon Name (Material Icons)", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { 
            name: "items", 
            label: "Bullet Points (One per line)", 
            type: "textarea", 
            required: true,
          },
          { name: "order", label: "Order", type: "number", required: true },
        ]}
      />
    </div>
  );
}
