"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const visibleIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Find all h2 and h3 elements within the article
    const elements = Array.from(document.querySelectorAll("article h2, article h3"));
    
    // Assign unique IDs if missing and build headings list
    const items = elements.map((elem, index) => {
        if (!elem.id) {
            elem.id = `toc-heading-${index}-${Math.random().toString(36).substring(2, 11)}`;
        }
        return {
            id: elem.id,
            text: elem.textContent || "",
            level: Number(elem.tagName.substring(1)),
        };
    });

    setHeadings(items);

    // Scroll Spy Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleIds.current.add(entry.target.id);
            } else {
                visibleIds.current.delete(entry.target.id);
            }
        });

        // Determine active heading
        if (visibleIds.current.size > 0) {
            // Find the first heading in our list that is currently visible
            // This preserves the document order
            const visibleHeading = items.find(h => visibleIds.current.has(h.id));
            if (visibleHeading) {
                setActiveId(visibleHeading.id);
            }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
        Table of Contents
      </h4>
      <div className="relative border-l border-white/10 pl-4">
        {/* Animated Active Indicator */}
        <ul className="space-y-0 relative">
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
                {activeId === heading.id && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute -left-[17px] top-1 bottom-1 w-[2px] bg-accent-blue rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
              <a 
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth"
                  });
                  setActiveId(heading.id);
                }}
                className={`block text-sm py-2 pr-4 transition-colors duration-200 ${
                    activeId === heading.id ? "text-accent-blue font-medium" : "text-gray-400 hover:text-white"
                }`}
                style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
