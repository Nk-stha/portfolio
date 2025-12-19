import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface NavArticle {
  slug: string;
  title: string;
}

interface ArticleNavigationProps {
  prev?: NavArticle;
  next?: NavArticle;
}

export function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/10">
      {prev ? (
        <Link 
            href={`/blog/${prev.slug}`}
            className="group flex flex-col p-6 rounded-2xl bg-[#242424]/50 border border-white/5 hover:bg-[#242424] hover:border-accent-blue/30 transition-all duration-300"
        >
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 group-hover:text-accent-blue transition-colors">
                <Icon name="arrow_back" size={14} />
                Previous Article
            </span>
            <span className="font-bold text-gray-200 group-hover:text-white line-clamp-2">
                {prev.title}
            </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link 
            href={`/blog/${next.slug}`}
            className="group flex flex-col items-end text-right p-6 rounded-2xl bg-[#242424]/50 border border-white/5 hover:bg-[#242424] hover:border-accent-blue/30 transition-all duration-300"
        >
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 group-hover:text-accent-blue transition-colors">
                Next Article
                <Icon name="arrow_forward" size={14} />
            </span>
            <span className="font-bold text-gray-200 group-hover:text-white line-clamp-2">
                {next.title}
            </span>
        </Link>
      ) : <div />}
    </div>
  );
}
