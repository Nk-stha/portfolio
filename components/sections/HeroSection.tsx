"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { SectionContainer } from "../ui/SectionContainer";
import type { Profile } from "@/lib/types/portfolio";
import { fadeInUp, fadeIn, scaleIn, staggerContainer, hoverGlow } from "@/lib/animations";

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  // Fallback values if profile not loaded
  const name = profile?.name || "Developer";
  const title = profile?.title || "Full Stack Engineer";
  const greeting = profile?.hero?.greeting || "Hello!";
  const tagline = profile?.hero?.tagline || "";
  const yearsExperience = profile?.hero?.yearsExperience || 0;
  const projectsShipped = profile?.hero?.projectsShipped || 0;
  const avatarUrl = profile?.avatarUrl || "/animatedprofile.png";

  return (
    <SectionContainer 
      id="hero" 
      backgroundColor="light" 
      className="pt-28 md:pt-40 relative overflow-hidden"
    >
      <motion.div 
        className="relative z-10 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer(0.15)}
      >
        {/* Hello Badge */}
        <motion.div 
          className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-full mb-6 bg-white dark:bg-surface-dark shadow-sm"
          variants={fadeInUp}
        >
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {greeting}
          </span>
          <motion.div
            animate={{ rotate: [0, -15, 10, -15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Icon
              name="waving_hand"
              className="text-primary ml-2 text-sm"
            />
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-7xl font-bold leading-tight mb-4 text-gray-900 dark:text-white"
          variants={fadeInUp}
        >
          I&apos;m <span className="text-primary">{name.split(" ")[0]},</span>
          <br />
          {title}
        </motion.h1>

        {/* Content Container with Image and Decorations */}
        <div className="relative mt-12">
          {/* Left Quote and Stats - Desktop Only */}
          <motion.div 
            className="absolute top-0 left-4 md:left-20 text-left max-w-[200px] hidden md:block"
            variants={fadeIn}
            custom={2} // Delay index
          >
            <div className="relative">
              <Icon
                name="format_quote"
                className="text-6xl text-gray-400 dark:text-gray-600 absolute top-0 right-50 opacity-20"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pt-4">
                {tagline}
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {projectsShipped}+
                </motion.span>
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Projects Shipped
              </p>
            </div>
          </motion.div>

          {/* Right Stats - Desktop Only */}
          <motion.div 
            className="absolute top-10 right-4 md:right-20 text-right hidden md:block"
            variants={fadeIn}
            custom={3}
          >
            <div className="flex justify-end text-primary mb-2">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + (i * 0.1) }}
                >
                  <Icon name="star" className="text-sm" />
                </motion.div>
              ))}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {yearsExperience} Years
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">Experts</p>
            <div className="h-0.5 w-full bg-gray-300 dark:bg-gray-700 mt-2"></div>
          </motion.div>

          {/* Hero Image Group */}
          <div className="relative inline-block">
            {/* Orange Circle Background */}
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[350px] bg-primary rounded-t-full opacity-90 z-0"
              variants={scaleIn}
            ></motion.div>

            {/* Profile Image - Floating */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Image
                alt={`Portrait of ${name}, ${title}`}
                className="w-[280px] md:w-[450px] mx-auto"
                src={avatarUrl}
                width={450}
                height={600}
                priority
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="absolute bottom-4 w-[335px] left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div whileHover="hover" variants={hoverGlow()} className="flex-1">
                 <Button href="/#portfolio" icon="north_east" className="w-full">
                  Portfolio
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
                 <Button href="/#contact" variant="ghost" className="w-full">
                  Hire Me
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
