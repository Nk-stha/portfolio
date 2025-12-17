import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost } from "@/lib/db/models";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  await connectToDatabase();
  const post = await BlogPost.findOne({
    slug,
    publishedAt: { $ne: null }, // Only show published
    deletedAt: null,
  }).lean();

  if (!post) return null;
  return JSON.parse(JSON.stringify(post));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        {post.featuredImage ? (
           <Image
             src={post.featuredImage}
             alt={post.title}
             fill
             className="object-cover opacity-50"
             priority
           />
        ) : (
            <div className="absolute inset-0 bg-[#111]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 pb-12">
            <div className="max-w-3xl mx-auto">
                <Link 
                    href="/blog"
                    className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm group"
                >
                    <Icon name="arrow_back" size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-primary mb-4 font-medium uppercase tracking-wider">
                    <span className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {post.category}
                    </span>
                    {post.publishedAt && (
                        <span className="flex items-center text-gray-300 normal-case tracking-normal">
                             <Icon name="calendar_today" size={14} className="mr-2" />
                             {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    {post.title}
                </h1>

                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 relative overflow-hidden ring-2 ring-primary/20">
                         {/* Author Avatar Placeholder */}
                         <div className="absolute inset-0 bg-primary/20 flex items-center justify-center font-bold text-primary">
                             {post.author?.name?.[0] || 'A'}
                         </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{post.author?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-400">Author</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-white prose-code:text-primary prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#222]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{post.content}</ReactMarkdown>
         </div>
         
         {/* Footer / Share / Tags could go here */}
         <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex justify-between items-center">
             <Link 
                href="/blog"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
             >
                 ← More Articles
             </Link>
             {/* Simple Scroll to top substitute */}
             <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                 <Icon name="arrow_upward" />
             </a>
         </div>
      </div>
    </article>
  );
}
