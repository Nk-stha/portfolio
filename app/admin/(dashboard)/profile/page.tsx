import { connectToDatabase } from "@/lib/db/mongoose";
import { Profile } from "@/lib/db/models";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

async function getProfile() {
  await connectToDatabase();
  const profile = await Profile.findOne().lean();
  if (!profile) return null;
  return JSON.parse(JSON.stringify(profile));
}

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProfileForm initialData={profile || {}} />
    </div>
  );
}
