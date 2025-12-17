export const dynamic = "force-dynamic";

import { Project } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import EditProjectForm from "./edit-form";

async function getProject(id: string) {
  await connectToDatabase();
  try {
      const project = await Project.findById(id).lean();
      if (!project) return null;
      return JSON.parse(JSON.stringify(project));
  } catch (e) {
      return null;
  }
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return <div className="text-white">Project not found</div>;
  }

  return <EditProjectForm project={project} />;
}
