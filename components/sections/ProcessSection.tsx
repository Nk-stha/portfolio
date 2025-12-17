"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import type { ProcessStep } from "@/lib/types/portfolio";

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-3 block">
              The Engineering Journey
            </span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              From <span className="text-white">Idea</span> to{" "}
              <span className="text-primary">Production</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-left md:text-right mt-8 md:mt-0 text-base leading-relaxed font-light">
            My systematic approach to building scalable, maintainable systems.
            From initial design to long-term observability.
          </p>
        </div>

        {/* Straight Timeline */}
        <div className="relative">
          {/* Straight Line (Desktop Only) - positioned at center of icon circles */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 z-0">
            <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary to-primary/20 blur-md rounded-full" />
          </div>

          {/* Process Cards - Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step) => (
              <div
                key={step._id}
                className="relative group"
                onMouseEnter={() => setActiveStep(step._id)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Icon Circle on the line */}
                <div className="flex flex-col items-center mb-4">
                  <div
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] border-2 z-20 transition-all duration-300 ${
                      activeStep === step._id
                        ? "border-primary shadow-[0_0_30px_rgba(255,87,34,0.4)] scale-110"
                        : "border-primary/40 shadow-[0_0_15px_rgba(255,87,34,0.1)]"
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm" />
                    <Icon name={step.icon} size={24} className="text-primary relative z-10" />
                  </div>
                </div>

                {/* Title - Always Visible */}
                <h3
                  className={`text-sm font-bold text-center mb-2 cursor-pointer transition-colors duration-300 leading-tight ${
                    activeStep === step._id ? "text-primary" : "text-white"
                  }`}
                >
                  {step.title}
                </h3>

                {/* Description - Revealed on Hover */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    activeStep === step._id
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
