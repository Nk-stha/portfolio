import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost } from "@/lib/db/models";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

async function getBlogData() {
  await connectToDatabase();
  const now = new Date();
  
  // Fetch ALL featured posts
  const featuredPosts = await BlogPost.find({
    publishedAt: { $ne: null, $lte: now },
    deletedAt: null,
    isFeatured: true
  })
  .sort({ publishedAt: -1 })
  .lean();

  // Get IDs of featured posts to exclude from regular list
  const featuredIds = featuredPosts.map((p: any) => p._id);

  // Fetch other posts
  const otherPosts = await BlogPost.find({
    publishedAt: { $ne: null, $lte: now },
    deletedAt: null,
    _id: { $nin: featuredIds }
  })
    .sort({ publishedAt: -1 })
    .lean();

  return {
    featuredPosts: JSON.parse(JSON.stringify(featuredPosts)),
    posts: JSON.parse(JSON.stringify(otherPosts))
  };
}

export default async function BlogPage() {
  const { featuredPosts, posts } = await getBlogData();
  
  // First featured post is Hero
  const heroPost = featuredPosts.length > 0 ? featuredPosts[0] : null;
  // Rest of featured posts
  const secondaryFeatured = featuredPosts.length > 1 ? featuredPosts.slice(1) : [];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-16">
       {/* Background Gradient */}
       <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-3 block">
            Insights & Thoughts
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Latest <span className="text-primary">Articles</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Thoughts on software engineering, architecture, and the journey of building products.
          </p>
        </div>

        {/* Hero Featured Post */}
        {heroPost && (
            <div className="mb-12">
                <Link href={`/blog/${heroPost.slug}`} className="group relative block rounded-3xl overflow-hidden aspect-[21/9] border border-[#222]">
                     {heroPost.featuredImage ? (
                        <Image
                            src={heroPost.featuredImage}
                            alt={heroPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-[#111] flex items-center justify-center">
                            <Icon name="image" size={64} className="text-gray-700" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                         <div className="max-w-3xl">
                             <div className="flex items-center space-x-3 mb-4">
                                 <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                     Featured
                                 </span>
                                 <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                     {heroPost.category}
                                 </span>
                             </div>
                             
                             <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                                 {heroPost.title}
                             </h2>
                             
                             <p className="text-gray-300 text-lg md:text-xl line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl">
                                 {heroPost.excerpt}
                             </p>
                             
                             <div className="flex items-center text-sm font-medium text-white space-x-4">
                                 <div className="flex items-center">
                                      {/* Avatar placeholder */}
                                     <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-2">
                                         {heroPost.author?.name?.[0] || 'A'}
                                     </div>
                                     {heroPost.author?.name || 'Admin'}
                                 </div>
                                 <span className="w-1 h-1 rounded-full bg-gray-500" />
                                 <span>{heroPost.publishedAt ? format(new Date(heroPost.publishedAt), "MMM d, yyyy") : "Draft"}</span>
                             </div>
                         </div>
                    </div>
                </Link>
            </div>
        )}

        {/* Secondary Featured Grid */}
        {secondaryFeatured.length > 0 && (
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Icon name="star" className="text-primary mr-2" size={24} />
                    More Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {secondaryFeatured.map((post: any) => (
                        <Link
                            key={post._id}
                            href={`/blog/${post.slug}`}
                            className="group bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
                        >
                             <div className="aspect-[16/9] relative overflow-hidden bg-gray-900">
                                {post.featuredImage ? (
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <Icon name="image" size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                                    <Icon name="star" size={12} className="inline mr-1" /> Featured
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{post.category}</span>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                <div className="mt-auto text-xs text-gray-500 flex items-center justify-between">
                                    <span>{post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "Draft"}</span>
                                    <span className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                        Read <Icon name="arrow_forward" size={14} className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* Regular Posts Grid */}
        {posts.length > 0 && (
          <div>
            {/* Show heading only if there are specific featured posts above to separate them */}
            {(heroPost || secondaryFeatured.length > 0) && (
                 <h2 className="text-2xl font-bold mb-6 flex items-center border-t border-[#222] pt-12">
                     All Articles
                </h2>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col h-full opacity-90 hover:opacity-100"
                >
                    <div className="aspect-video relative overflow-hidden bg-gray-900">
                    {post.featuredImage ? (
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <Icon name="image" size={48} />
                        </div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                        {post.category}
                    </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                        <span className="flex items-center">
                            <Icon name="calendar_today" size={14} className="mr-1" />
                            {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "Draft"}
                        </span>
                        <span className="flex items-center">
                            <Icon name="schedule" size={14} className="mr-1" /> 
                            {/* Simple read time estimation: 200 words per minute */}
                            {Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 0) / 200))} min read
                        </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a] mt-auto">
                        <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-800 relative overflow-hidden mr-2">
                                {/* Placeholder for author avatar if needed */}
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {post.author?.name?.[0] || 'A'}
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">{post.author?.name || 'Admin'}</span>
                        </div>
                        <span className="text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                            Read Article <Icon name="arrow_forward" size={16} className="ml-1" />
                        </span>
                    </div>
                    </div>
                </Link>
                ))}
            </div>
          </div>
        )}
        
        {posts.length === 0 && !heroPost && (
             <div className="text-center py-20">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <Icon name="article" size={32} />
                </div>
                <p className="text-gray-400">No articles published yet. Check back soon!</p>
              </div>
        )}
      </div>
    </main>
  );
}
