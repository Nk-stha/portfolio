export const dynamic = "force-dynamic";

import { BlogPost } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogClient } from "./blog-client";

async function getPosts() {
  await connectToDatabase();
  const posts = await BlogPost.find({ deletedAt: null })
    .sort({ publishedAt: -1 })
    .lean();
    
  return JSON.parse(JSON.stringify(posts));
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Blog Posts</h2>
      </div>
      <BlogClient posts={posts} />
    </div>
  );
}
