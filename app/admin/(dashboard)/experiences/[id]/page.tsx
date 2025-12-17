import { connectToDatabase } from "@/lib/db/mongoose";
import { Experience } from "@/lib/db/models";
import EditExperienceForm from "./edit-form";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
    const { id } = await params;
  await connectToDatabase();
  const experience = await Experience.findById(id).lean();

  if (!experience) {
    notFound();
  }

  return <EditExperienceForm initialData={JSON.parse(JSON.stringify(experience))} />;
}
