import { connectToDatabase } from "@/lib/db/mongoose";
import { ProcessStep } from "@/lib/db/models";
import { ProcessClient } from "./process-client";

export const dynamic = "force-dynamic";

async function getProcessSteps() {
  await connectToDatabase();
  const steps = await ProcessStep.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(steps));
}

export default async function ProcessPage() {
  const steps = await getProcessSteps();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Process Steps</h2>
          <p className="text-muted-foreground">
            Manage your engineering journey steps.
          </p>
        </div>
      </div>
      <ProcessClient initialData={steps} />
    </div>
  );
}
