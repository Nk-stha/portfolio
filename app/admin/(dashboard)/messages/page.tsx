import { connectToDatabase } from "@/lib/db/mongoose";
import { ContactSubmission } from "@/lib/db/models";
import { MessagesClient } from "./messages-client";

export const dynamic = "force-dynamic";

async function getMessages() {
  await connectToDatabase();
  const messages = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(messages));
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Messages</h2>
          <p className="text-muted-foreground">
            View and manage contact form submissions.
          </p>
        </div>
      </div>
      <MessagesClient initialData={messages} />
    </div>
  );
}
