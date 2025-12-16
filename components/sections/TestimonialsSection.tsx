import React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants/portfolio-data";
import { Icon } from "../ui/Icon";

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary-dark text-white rounded-t-[3rem] -mb-10 relative z-10 mx-2 md:mx-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          <Icon
            name="star_border"
            className="absolute top-0 left-1/4 text-4xl text-gray-600 animate-pulse"
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
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-surface-dark p-8 rounded-3xl relative ${
                testimonial.isPrimary ? "" : "opacity-80 md:opacity-100"
              }`}
            >
              {/* Quote Icon */}
              <Icon
                name="format_quote"
                className={`text-6xl text-gray-700 absolute ${
                  testimonial.isPrimary
                    ? "top-4 right-4"
                    : "bottom-4 right-4 transform rotate-180"
                } opacity-20`}
              />

              {/* Rating */}
              <div className="flex text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" className="text-sm" />
                ))}
                <span className="ml-2 text-white text-sm font-bold">
                  {testimonial.rating.toFixed(1)}
                </span>
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center">
                <Image
                  alt={testimonial.name}
                  className={`w-12 h-12 rounded-full mr-4 border-2 ${
                    testimonial.isPrimary ? "border-primary" : "border-gray-600"
                  }`}
                  src={testimonial.image}
                  width={48}
                  height={48}
                />
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center mt-12 gap-4">
          <button className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
            <Icon name="arrow_back" />
          </button>
          <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    </section>
  );
}
