import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost } from "@/lib/db/models";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ArticleNavigation } from "@/components/blog/ArticleNavigation";
import { ScrollToTop } from "@/components/blog/ScrollToTop";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { ZoomImage } from "@/components/blog/ZoomImage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  await connectToDatabase();
  const post = await BlogPost.findOne({
    slug,
    publishedAt: { $ne: null },
    deletedAt: null,
  }).lean();

  if (!post) return null;
  return JSON.parse(JSON.stringify(post));
}

async function getRelatedPosts(currentId: string, category: string) {
  await connectToDatabase();
  // Get 3 related posts by category, excluding current
  const related = await BlogPost.find({
    _id: { $ne: currentId },
    category: category,
    publishedAt: { $ne: null },
    deletedAt: null,
  })
  .sort({ publishedAt: -1 })
  .limit(3)
  .lean();

  // Get Next/Prev based on published date
  const currentPost = await BlogPost.findById(currentId);
  if (!currentPost) return { related: [], next: null, prev: null };

  const now = new Date();
  const next = await BlogPost.findOne({
    publishedAt: { $gt: currentPost.publishedAt, $lte: now },
    deletedAt: null
  }).sort({ publishedAt: 1 }).select('slug title').lean();

  const prev = await BlogPost.findOne({
    publishedAt: { $lt: currentPost.publishedAt, $lte: now },
    deletedAt: null
  }).sort({ publishedAt: -1 }).select('slug title').lean();

  return {
    related: JSON.parse(JSON.stringify(related)),
    next: next ? JSON.parse(JSON.stringify(next)) : null,
    prev: prev ? JSON.parse(JSON.stringify(prev)) : null
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const { related, next, prev } = await getRelatedPosts(post._id, post.category);

  // Estimate reading time (simple words/200)
  const wordCount = post.content?.split(/\s+/g).length || 0;
  const readingTime = `${Math.ceil(wordCount / 200)} min read`;

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-gray-300 pb-20 selection:bg-accent-blue/30 selection:text-accent-blue">
      <ReadingProgressBar />
      
      <BlogHero 
        title={post.title}
        category={post.category}
        publishedAt={post.publishedAt}
        featuredImage={post.featuredImage}
        author={post.author || { name: 'Admin' }}
        readingTime={readingTime}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Main Content Column */}
            <main className="flex-1 w-full min-w-0 pt-12">
                <div className="prose prose-invert prose-lg max-w-[780px] mx-auto
                    prose-headings:font-bold prose-headings:text-white prose-headings:scroll-mt-24
                    prose-p:text-gray-300 prose-p:leading-8
                    prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-white/10
                    prose-li:text-gray-300
                    prose-blockquote:border-l-accent-blue prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-code:text-accent-blue prose-code:bg-accent-blue/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                ">
                  <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} 
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            code: ({node, inline, className, children, ...props}: any) => (
                                <CodeBlock inline={inline} className={className} {...props}>
                                    {children}
                                </CodeBlock>
                            ),
                            img: ({node, src, alt, ...props}) => (
                                <ZoomImage src={(src as string) || ''} alt={alt || ''} />
                            ),
                            h2: ({node, children, ...props}) => {
                                const id = getTextFromChildren(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                                return <h2 id={id} {...props}>{children}</h2>;
                            },
                            h3: ({node, children, ...props}) => {
                                const id = getTextFromChildren(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                                return <h3 id={id} {...props}>{children}</h3>;
                            },
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                <ArticleNavigation next={next} prev={prev} />
                <RelatedArticles articles={related} />
            </main>

            {/* Sidebar Column */}
            <div className="hidden lg:block w-[300px] flex-shrink-0 pt-12">
                <BlogSidebar />
            </div>
        </div>
      </div>

      <ScrollToTop />
    </article>
  );
}

function getTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return children.toString();
  if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
  if (/* React Element */ typeof children === 'object' && children !== null && 'props' in children) {
     return getTextFromChildren((children as any).props.children);
  }
  return '';
}
