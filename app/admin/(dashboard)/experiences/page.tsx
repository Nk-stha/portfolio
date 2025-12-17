import { connectToDatabase } from "@/lib/db/mongoose";
import { Experience } from "@/lib/db/models";
import { ExperiencesClient } from "./experiences-client";

export const dynamic = "force-dynamic";

async function getExperiences() {
  await connectToDatabase();
  // Using .lean() and converting _id to string manually if needed, 
  // but JSON.parse(JSON.stringify()) is a safe bet for generic object passing in server components
  const experiences = await Experience.find({ deletedAt: null }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(experiences));
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Experiences</h2>
          <p className="text-muted-foreground">
            Manage your professional experiences here using the form.
          </p>
        </div>
      </div>
      <ExperiencesClient initialData={experiences} />
    </div>
  );
}
