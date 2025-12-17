export const dynamic = "force-dynamic";

import { Project } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProjectsClient } from "./projects-client";

async function getProjects() {
  await connectToDatabase();
  const projects = await Project.find({ deletedAt: null })
    .sort({ order: 1 })
    .lean();
    
  return JSON.parse(JSON.stringify(projects));
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Projects</h2>
      </div>
      <ProjectsClient projects={projects} />
    </div>
  );
}
