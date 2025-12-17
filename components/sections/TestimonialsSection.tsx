"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { Testimonial } from "@/lib/types/portfolio";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section className="py-24 bg-secondary-dark text-white rounded-t-[3rem] -mb-10 relative z-10 mx-2 md:mx-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Icon
            name="star_border"
            className="absolute top-0 left-1/4 text-4xl text-gray-600 animate-pulse hidden md:block"
          />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Testimonials that
            <br />
            Speak to <span className="text-primary">My Results</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Don&apos;t just take my word for it. Here&apos;s what CTOs and
            Product Managers say about working with me.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto min-h-[500px] md:min-h-[300px] h-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <div className="bg-surface-dark p-8 md:p-12 rounded-3xl relative mx-auto shadow-2xl">
                {/* Quote Icon */}
                <Icon
                  name="format_quote"
                  className="text-6xl text-gray-700 absolute top-4 right-4 opacity-20"
                />

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Author Image */}
                  <div className="flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-20" />
                        <Image
                        alt={currentTestimonial.author.name}
                        className="w-20 h-20 rounded-full border-2 border-primary object-cover"
                        src={currentTestimonial.author.image}
                        width={80}
                        height={80}
                        />
                    </motion.div>
                  </div>

                  <div className="flex-1">
                    {/* Rating */}
                    <div className="flex text-primary mb-4">
                        {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                        >
                            <Icon name="star" className="text-lg" />
                        </motion.div>
                        ))}
                    </div>

                    {/* Quote */}
                    <motion.p 
                        className="text-gray-300 text-lg leading-relaxed mb-6 italic"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        &quot;{currentTestimonial.quote}&quot;
                    </motion.p>

                    {/* Author Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h4 className="font-bold text-white text-lg">{currentTestimonial.author.name}</h4>
                        <p className="text-sm text-gray-400">
                        {currentTestimonial.author.role}, {currentTestimonial.author.company}
                        </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center mt-8 gap-4 z-20 relative">
          <button 
            onClick={() => paginate(-1)}
            className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors z-20"
          >
            <Icon name="arrow_back" />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 z-20"
          >
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    </section>
  );
}
