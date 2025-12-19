import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export interface RelatedArticle {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  readTime?: string;
  publishedAt: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-24 pt-12 border-t border-white/10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Icon name="library_books" className="text-accent-blue" />
        Related Articles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/blog/${article.slug}`}
            className="group block bg-[#242424] rounded-2xl overflow-hidden border border-white/5 hover:border-accent-blue/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-48 w-full overflow-hidden">
              {article.featuredImage ? (
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                 <span className="flex items-center gap-1">
                    <Icon name="schedule" size={14} />
                    {article.readTime || "5 min read"}
                 </span>
                 <span>•</span>
                 <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              
              <h4 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                {article.title}
              </h4>
              
              <p className="text-gray-400 text-sm line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
