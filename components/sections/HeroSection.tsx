import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function HeroSection() {
  return (
    <section className="pt-40 pb-20 relative overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Hello Badge */}
        <div className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-full mb-6 bg-white dark:bg-surface-dark shadow-sm">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Hello!
          </span>
          <Icon
            name="waving_hand"
            className="text-primary ml-2 text-sm"
            style={{ transform: "rotate(-15deg)" }}
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4 text-gray-900 dark:text-white">
          I&apos;m <span className="text-primary">Rohan,</span>
          <br />
          Full Stack Engineer
        </h1>

        {/* Content Container with Image and Decorations */}
        <div className="relative mt-12 mb-20">
          {/* Left Quote and Stats */}
          <div className="absolute top-0 left-4 md:left-20 text-left max-w-[200px] hidden md:block">
            <span className="text-4xl text-gray-800 dark:text-gray-200 font-serif">
              &quot;
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Jenny&apos;s robust code architecture scaled our platform to
              millions of users seamlessly.
            </p>
            <div className="mt-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                50+
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Projects Shipped
              </p>
            </div>
          </div>

          {/* Right Stats */}
          <div className="absolute top-10 right-4 md:right-20 text-right hidden md:block">
            <div className="flex justify-end text-primary mb-2">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" className="text-sm" />
              ))}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              10 Years
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">Experts</p>
            <div className="h-0.5 w-full bg-gray-300 dark:bg-gray-700 mt-2"></div>
          </div>

          {/* Hero Image */}
          <div className="relative inline-block">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary rounded-t-full opacity-90 z-0"></div>
            <Image
              alt="Portrait of Jenny, Full Stack Engineer"
              className="relative z-10 w-[280px] md:w-[450px] mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy5IU835WnQOLt84hZUb5S8JwuuVXMslxeVwjV_eKZD1oVyGW_sYrnpWdQrBCdD4ys0Sor-Rs_TKe9RmHyMmZSBAw4AGVHUPYBluPN5a0ca90_acOVh6kCZAEsfdAffYxi2PgRo3MElkz_kelN-SEiZ0nNhFCKJrbae2ysibrLN3LwxNPzqaMERf3Aue1HWvZh1hDJ0T5vI_9rvaAMVqVtdxkgkY7Exu5fTRhp5oFh0b3N-a5BZIZLIyktV8DAgvNeunsTl-JJMwA"
              width={450}
              height={600}
              priority
            />

            {/* CTA Buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/20">
              <Button href="#portfolio" icon="north_east">
                Portfolio
              </Button>
              <Button href="#contact" variant="ghost">
                Hire Me
              </Button>
            </div>

            {/* Decorative Arrow SVG */}
            <svg
              className="absolute bottom-10 -left-12 md:-left-24 w-24 h-24 text-gray-400 dark:text-gray-600 hidden md:block"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 100 100"
            >
              <path d="M80,20 Q10,50 40,80"></path>
              <path d="M35,75 L40,80 L45,75"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
