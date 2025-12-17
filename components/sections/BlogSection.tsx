"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import type { BlogPost } from "@/lib/types/portfolio";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background-light dark:bg-background-dark">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer(0.15)}
      >
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 dark:text-white max-w-xs"
            variants={fadeInUp}
          >
            From my
            <br />
            blog post
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Button href="/blog" icon="north_east">
              View All
            </Button>
          </motion.div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div 
              key={post._id} 
              className="group"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Post Image */}
              <div className="rounded-3xl overflow-hidden mb-6 relative h-64 group/image">
                <Link href={`/blog/${post.slug}`} className="block h-full w-full">
                    <Image
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={post.featuredImage}
                    width={400}
                    height={300}
                    />
                </Link>
                <div
                  className={`absolute bottom-4 right-4 w-12 h-12 pointer-events-none ${
                    post.isFeatured
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-surface-dark text-gray-900 dark:text-white"
                  } rounded-full flex items-center justify-center group-hover/image:bg-primary group-hover/image:text-white transition-colors`}
                >
                  <Icon name="arrow_outward" />
                </div>
              </div>

              {/* Post Category */}
              <div className="mb-3">
                <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>

              {/* Post Title */}
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h3>
              </Link>

              {/* Post Meta */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                {post.author.name}
                <span className="mx-2">•</span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
