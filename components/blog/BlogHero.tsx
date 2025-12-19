import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Icon } from "@/components/ui/Icon";

interface BlogHeroProps {
  title: string;
  category?: string;
  publishedAt?: string;
  featuredImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  readingTime?: string;
}

export function BlogHero({ title, category, publishedAt, featuredImage, author, readingTime }: BlogHeroProps) {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like fixity or just absolute */}
      <div className="absolute inset-0 z-0">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#0f0f0f]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-black/30" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" /> 
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center w-full mt-16">
        <Link 
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors text-sm group bg-black/30 backdrop-blur-sm pr-4 pl-3 py-1.5 rounded-full border border-white/10 hover:border-accent-blue/50"
        >
            <Icon name="arrow_back" size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
        </Link>
        
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium mb-6">
            {category && (
                <span className="bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full border border-accent-blue/20 uppercase tracking-wider text-xs">
                    {category}
                </span>
            )}
            {publishedAt && !isNaN(new Date(publishedAt).getTime()) && (
                <span className="flex items-center text-gray-300">
                      <Icon name="calendar_today" size={14} className="mr-1.5" />
                      {format(new Date(publishedAt), "MMMM d, yyyy")}
                </span>
            )}
            {readingTime && (
                <span className="flex items-center text-gray-300">
                    <span className="mx-2 text-gray-600">•</span>
                    <Icon name="schedule" size={14} className="mr-1.5" />
                    {readingTime}
                </span>
            )}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white tracking-tight drop-shadow-xl text-shadow-sm">
            {title}
        </h1>

        <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-purple-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-gray-900 border-2 border-transparent overflow-hidden relative">
                         {author?.avatar ? (
                             <Image 
                                src={author.avatar} 
                                alt={author.name} 
                                fill 
                                className="object-cover"
                             />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold">
                                {author?.name?.[0] || 'A'}
                            </div>
                         )}
                    </div>
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white">{author?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-400">Author</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
