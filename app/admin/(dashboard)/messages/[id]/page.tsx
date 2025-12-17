import { connectToDatabase } from "@/lib/db/mongoose";
import { ContactSubmission } from "@/lib/db/models";
import EditMessageForm from "./edit-form";
import { notFound } from "next/navigation";

export default async function MessageDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
    const { id } = await params;
  await connectToDatabase();
  const message = await ContactSubmission.findById(id).lean();

  if (!message) {
    notFound();
  }

  return <EditMessageForm initialData={JSON.parse(JSON.stringify(message))} />;
}
