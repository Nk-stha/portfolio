import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { SectionContainer } from "../ui/SectionContainer";
import type { Profile } from "@/lib/types/portfolio";

interface AboutSectionProps {
  profile: Profile | null;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const name = profile?.name || "Developer";
  const avatarUrl = profile?.avatarUrl || "/animatedprofile.png";
  const headline = profile?.about?.headline || "Why You Hire Me for Your Next Project?";
  const description = profile?.about?.description || "";
  const stats = profile?.about?.stats || [];

  return (
    <SectionContainer id="about" backgroundColor="gray">
      <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left - Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square bg-primary rounded-full relative overflow-hidden">
              <Image
                alt={`${name} Portrait`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                src={avatarUrl}
                width={500}
                height={500}
                priority
              />
              {/* Decorative Elements */}
              <div className="absolute top-10 right-10 w-4 h-4 bg-black rounded-full opacity-20"></div>
              <div className="absolute bottom-20 -left-4 text-4xl text-black opacity-20 font-serif rotate-12">
                {"}"}
              </div>
              <div className="absolute top-20 -right-4 text-4xl text-white opacity-20 font-serif -rotate-12">
                {"{"}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Why You <span className="text-primary">Hire Me</span> for Your
              Next Project?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              {stats.map((stat, index) => (
                <div key={index}>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Button href="#contact" variant="outline">
              Hire Me
            </Button>
          </div>
        </div>
    </SectionContainer>
  );
}
