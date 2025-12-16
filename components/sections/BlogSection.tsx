import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/constants/portfolio-data";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";

export function BlogSection() {
  return (
    <section className="py-24 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white max-w-xs">
            From my
            <br />
            blog post
          </h2>
          <Button href="#" icon="north_east">
            View All
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="group">
              {/* Post Image */}
              <div className="rounded-3xl overflow-hidden mb-6 relative h-64">
                <Image
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={post.image}
                  width={400}
                  height={300}
                />
                <Link
                  href="#"
                  className={`absolute bottom-4 right-4 w-12 h-12 ${
                    post.isPrimary
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-surface-dark text-gray-900 dark:text-white"
                  } rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors`}
                >
                  <Icon name="arrow_outward" />
                </Link>
              </div>

              {/* Post Category */}
              <div className="mb-3">
                <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>

              {/* Post Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </h3>

              {/* Post Meta */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                {post.author}
                <span className="mx-2">•</span>
                {post.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
