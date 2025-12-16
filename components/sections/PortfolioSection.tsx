"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/constants/portfolio-data";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "saas", label: "SaaS Platforms" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "mobile", label: "Mobile Apps" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeFilter);

  return (
    <section
      className="py-24 bg-background-light dark:bg-background-dark"
      id="portfolio"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 md:mb-0">
            Let&apos;s Have a Look at
            <br />
            my <span className="text-primary">Portfolio</span>
          </h2>
          <Button href="#" icon="arrow_forward" className="hidden md:flex">
            See More
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Navigation Arrows */}
          <button className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 shadow-lg hover:bg-gray-700 hidden lg:block">
            <Icon name="arrow_back" />
          </button>
          <button className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 bg-primary text-white p-3 rounded-full z-10 shadow-lg hover:bg-orange-600 hidden lg:block">
            <Icon name="arrow_forward" />
          </button>

          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-gray-100 dark:bg-surface-dark rounded-3xl p-4 md:p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="rounded-2xl overflow-hidden mb-6 relative h-[300px]">
                <Image
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={project.image}
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href="#"
                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    View Case Study
                  </Link>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {project.description}
              </p>

              <div className="flex gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white inline-flex items-center">
            Full Stack Development Solution
            <span className="ml-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
              <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
            </span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-4 text-sm">
            From database schema design to frontend component libraries, I
            provide comprehensive development services that ensure your product
            is robust, scalable, and delightful to use.
          </p>
        </div>
      </div>
    </section>
  );
}
