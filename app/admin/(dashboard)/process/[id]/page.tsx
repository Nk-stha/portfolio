import { connectToDatabase } from "@/lib/db/mongoose";
import { ProcessStep } from "@/lib/db/models";
import { EditProcessForm } from "./edit-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProcessPage({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();
  
  const step = await ProcessStep.findById(id).lean();

  if (!step) {
    notFound();
  }

  return <EditProcessForm initialData={JSON.parse(JSON.stringify(step))} />;
}
