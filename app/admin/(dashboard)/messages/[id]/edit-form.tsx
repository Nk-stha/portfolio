"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { authenticatedFetch } from "@/lib/client/auth-client";

export default function EditMessageForm({ initialData }: { initialData: any }) {
  const fields = [
    { name: "name", label: "Name", type: "text" as const, required: true, disabled: true },
    { name: "email", label: "Email", type: "text" as const, required: true, disabled: true },
    { name: "message", label: "Message", type: "textarea" as const, required: true, disabled: true },
    { name: "source", label: "Source", type: "text" as const, disabled: true },
    { name: "ipAddress", label: "IP Address", type: "text" as const, disabled: true },
    { 
        name: "status", 
        label: "Status", 
        type: "select" as const, 
        required: true,
        options: [
            { label: "New", value: "new" },
            { label: "Read", value: "read" },
            { label: "Replied", value: "replied" },
        ]
    },
  ];

  const handleSubmit = async (data: any) => {
    // Only send the status update, but for simplicity ResourceForm sends everything.
    // The API should handle partial or full updates.
    
    // We only want to update status.
    const payload = { status: data.status };

    const res = await authenticatedFetch(`/api/contact/${initialData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update message status");
  };

  return (
    <ResourceForm
      resourceName="Message"
      initialData={initialData}
      fields={fields}
      onSubmit={handleSubmit}
      backHref="/admin/messages"
    />
  );
}
