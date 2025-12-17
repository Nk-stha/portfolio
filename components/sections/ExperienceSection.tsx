import React from "react";
import type { Experience } from "@/lib/types/portfolio";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background-light dark:bg-background-dark" id="resume">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          My Work Experience
        </h2>

        <div className="relative">
          {/* Vertical Timeline Line (Desktop Only) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          {/* Experience Items */}
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative"
            >
              {/* Left Side - Company Info */}
              <div className="w-full md:w-5/12 text-left md:text-right pr-0 md:pr-8 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {exp.company}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {exp.period}
                </p>
              </div>

              {/* Center Timeline Dot (Desktop Only) */}
              <div
                className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 z-10 hidden md:block ${
                  exp.isPrimary
                    ? "border-primary shadow-[0_0_0_4px_rgba(255,87,34,0.2)]"
                    : "border-gray-600 bg-surface-dark"
                }`}
              ></div>

              {/* Right Side - Role and Description */}
              <div className="w-full md:w-5/12 pl-4 md:pl-8 border-l-2 border-gray-200 dark:border-gray-700 md:border-l-0">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {exp.role}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
