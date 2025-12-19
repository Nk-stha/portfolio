"use client";

import { TableOfContents } from "./TableOfContents";
import { Twitter, Linkedin, Facebook } from "lucide-react";

export function BlogSidebar() {
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const title = typeof document !== 'undefined' ? encodeURIComponent(document.title) : '';

  const shareLinks = [
    { name: "Twitter", icon: Twitter, url: `https://twitter.com/intent/tweet?text=${title}&url=${shareUrl}` },
    { name: "LinkedIn", icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}` },
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
  ];

  return (
    <aside className="hidden lg:block w-full max-w-[280px] space-y-8 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pl-4">
      
      <TableOfContents />

      <div className="border-t border-white/10 pt-8">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
          Share Article
        </h4>
        <div className="flex gap-2">
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#242424] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-all duration-300 group"
                    title={`Share on ${link.name}`}
                >
                    <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
            ))}
        </div>
      </div>
      
      {/* Newsletter or extra widget could go here */}
    </aside>
  );
}
