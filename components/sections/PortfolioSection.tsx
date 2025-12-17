"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import type { Project } from "@/lib/types/portfolio";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface PortfolioSectionProps {
  projects: Project[];
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "saas", label: "SaaS Platforms" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "web", label: "Web Apps" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="py-24 bg-background-light dark:bg-background-dark overflow-hidden"
      id="portfolio"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.1)}
        >
          <motion.h2 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-6 md:mb-0"
            variants={fadeInUp}
          >
            Let&apos;s Have a Look at
            <br />
            my <span className="text-primary">Portfolio</span>
          </motion.h2>
          <motion.div variants={fadeInUp} className="hidden md:block">
            <Button href="/projects" icon="arrow_forward">
              See More
            </Button>
          </motion.div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10 ${
                activeFilter === category.id
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {activeFilter === category.id && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 relative min-h-[500px]"
        >
          {/* Active Presence to animate items leaving and entering */}
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-gray-100 dark:bg-surface-dark rounded-3xl p-4 md:p-6 hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-300"
              >
                <div className="rounded-2xl overflow-hidden mb-6 relative h-[300px]">
                  <Image
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={project.image}
                    width={600}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      href={`/projects/${project._id}`}
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105 active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <Link href={`/projects/${project._id}`}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-2">
                    {project.title}
                    <Icon name="arrow_outward" className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                  </h3>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 group-hover:border-primary/30 transition-colors"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white inline-flex items-center">
            Full Stack Development Solution
            <motion.span 
              className="ml-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs"
              whileHover={{ rotate: 45 }}
            >
              <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
            </motion.span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-4 text-sm">
            From database schema design to frontend component libraries, I
            provide comprehensive development services that ensure your product
            is robust, scalable, and delightful to use.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
