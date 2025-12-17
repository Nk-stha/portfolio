export const dynamic = "force-dynamic";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { BlogPost } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
// Note: We can't use "use client" on the default export if we fetch data directly here. 
// BUT ResourceForm IS a client component.
// Pattern: Server Component fetches data -> Passes to Client Component Wrapper or Client Form.
// Since params are async in Next.js 15 (and 16?), we need to await them.

// Wrapper for Client Side Logic
import EditBlogForm from "./edit-form"; 

async function getPost(slug: string) {
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug, deletedAt: null }).lean();
  if (!post) return null;
  return JSON.parse(JSON.stringify(post));
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return <div className="text-white">Post not found</div>;
  }

  return <EditBlogForm post={post} />;
}
