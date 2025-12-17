"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/types/portfolio";
import { staggerContainer, slideInLeft, slideInRight, scaleIn } from "@/lib/animations";

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
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
        >
          My Work Experience
        </motion.h2>

        <motion.div 
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer(0.2)}
        >
          {/* Vertical Timeline Line (Desktop Only) */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"
          ></motion.div>

          {/* Experience Items */}
          {experiences.map((exp, index) => (
            <div
              key={exp._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative"
            >
              {/* Left Side - Company Info */}
              <motion.div 
                className="w-full md:w-5/12 text-left md:text-right pr-0 md:pr-8 mb-4 md:mb-0"
                variants={slideInLeft}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {exp.company}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {new Date(exp.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Present"}
                </p>
              </motion.div>

              {/* Center Timeline Dot (Desktop Only) */}
              <motion.div
                variants={scaleIn}
                className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 z-10 hidden md:block ${
                  exp.isPrimary
                    ? "border-primary shadow-[0_0_0_4px_rgba(255,87,34,0.2)]"
                    : "border-gray-600 bg-surface-dark"
                }`}
              ></motion.div>

              {/* Right Side - Role and Description */}
              <motion.div 
                className="w-full md:w-5/12 pl-4 md:pl-8 border-l-2 border-gray-200 dark:border-gray-700 md:border-l-0"
                variants={slideInRight}
              >
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {exp.role}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
