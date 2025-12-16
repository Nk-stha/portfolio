import React from "react";
import { PROCESS_STEPS } from "@/lib/constants/portfolio-data";
import { Icon } from "../ui/Icon";

export function ProcessSection() {
  return (
    <section
      className="py-24 bg-secondary-dark text-white rounded-3xl mx-2 md:mx-4"
      id="services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
              The Engineering Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              From Concept to <span className="text-primary">Deployed Code</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-left md:text-right mt-6 md:mt-0 text-sm leading-relaxed">
            I don&apos;t just write code; I partner with you through the entire
            software lifecycle. Here is my structured approach to delivering
            high-performance digital products.
          </p>
        </div>

        {/* Timeline Line (Desktop Only) */}
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 rounded-full z-0"></div>

          {/* Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.id} className="relative group">
                {/* Icon Circle (Desktop Only) */}
                <div className="hidden lg:flex items-center justify-center w-24 h-24 rounded-full bg-surface-dark border-4 border-secondary-dark absolute -top-12 left-1/2 -translate-x-1/2 z-10 group-hover:border-primary transition-colors duration-300">
                  <Icon name={step.icon} className="text-primary text-3xl" />
                </div>

                {/* Card */}
                <div className="bg-surface-dark p-8 rounded-3xl h-full border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 lg:mt-16 relative">
                  {/* Mobile Icon */}
                  <div className="lg:hidden w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Icon name={step.icon} className="text-primary text-2xl" />
                  </div>

                  {/* Step Number */}
                  <span className="text-6xl font-bold text-white/5 absolute top-4 right-4 font-serif">
                    0{step.id}
                  </span>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Items List */}
                  <ul className="space-y-2">
                    {step.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start text-xs text-gray-300"
                      >
                        <Icon
                          name="check_circle"
                          className="text-primary text-[14px] mr-2 mt-0.5"
                        />
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
