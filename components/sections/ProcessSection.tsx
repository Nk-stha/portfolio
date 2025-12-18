"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { motion } from "framer-motion";
import type { ProcessStep } from "@/lib/types/portfolio";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  if (steps.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <section
      className="py-24 bg-[#0a0a0a] text-white rounded-3xl mx-2 md:mx-4 relative overflow-hidden"
      id="services"
    >
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer(0.2)}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <motion.div className="max-w-2xl" variants={fadeInUp}>
            <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-3 block">
              The Engineering Journey
            </span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              From <span className="text-white">Idea</span> to{" "}
              <span className="text-primary">Production</span>
            </h2>
          </motion.div>
          <motion.p 
            className="text-gray-400 max-w-md text-left md:text-right mt-8 md:mt-0 text-base leading-relaxed font-light"
            variants={fadeInUp}
          >
            My systematic approach to building scalable, maintainable systems.
            From initial design to long-term observability.
          </motion.p>
        </div>

        {/* Straight Timeline */}
        <div className="relative">
          {/* Straight Line (Desktop Only) - Progressive Draw */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 z-0 overflow-hidden">
            <motion.div 
              className="w-full h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"
              initial={{ x: "-100%" }}
              whileInView={{ x: "0%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Vertical Line (Mobile/Tablet) - Progressive Draw */}
          <div className="lg:hidden absolute top-0 bottom-0 left-[50%] md:left-[50%] w-1 -translate-x-1/2 z-0 overflow-hidden">
             <motion.div 
              className="w-full h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20 rounded-full"
              initial={{ y: "-100%" }}
              whileInView={{ y: "0%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Process Cards - Responsive Flex */}
          <div className="flex flex-col lg:flex-row gap-8 relative z-10 justify-between items-start">
            {steps.map((step, index) => (
              <motion.div
                key={step._id}
                className="relative group flex-1 w-full lg:w-auto flex flex-col items-center"
                onMouseEnter={() => setActiveStep(step._id)}
                onMouseLeave={() => setActiveStep(null)}
                // Staggered slide in: Odd from top (-y), Even from bottom (y) or just fade up staggering
                variants={{
                    hidden: { opacity: 0, y: index % 2 === 0 ? -30 : 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
              >
                {/* Icon Circle on the line */}
                <div className="flex flex-col items-center mb-4">
                  <motion.div
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] border-2 z-20 transition-colors duration-300 ${
                      activeStep === step._id
                        ? "border-primary shadow-[0_0_30px_rgba(255,87,34,0.4)]"
                        : "border-primary/40 shadow-[0_0_15px_rgba(255,87,34,0.1)]"
                    }`}
                    animate={{ scale: activeStep === step._id ? 1.1 : 1 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm" />
                    <Icon name={step.icon} size={24} className="text-primary relative z-10" />
                  </motion.div>
                </div>

                {/* Title */}
                <h3
                  className={`text-sm font-bold text-center mb-2 cursor-pointer transition-colors duration-300 leading-tight ${
                    activeStep === step._id ? "text-primary" : "text-white"
                  }`}
                >
                  {step.title}
                </h3>

                {/* Description - Revealed on Hover */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: activeStep === step._id ? "auto" : 0, 
                    opacity: activeStep === step._id ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-400 text-xs text-center mb-3 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-1">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-center text-xs text-gray-300 justify-center">
                        <span className="w-1 h-1 rounded-full bg-primary mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
