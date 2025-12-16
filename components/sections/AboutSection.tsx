import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";

export function AboutSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left - Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square bg-primary rounded-full relative overflow-visible">
              <Image
                alt="Jenny Portrait"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] z-10 rounded-b-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-dBgdVA8mqpxYOQUYqKqD4DAV61UTuyNKTZy-a_YMFyAZW5SDABmuCpdwWokDM1BjjNsKen9JXzLVZ5d5zZXZJix3WS6Hl-MkG0I2sIpMJK5te07i62deJaZY6j26Dj5GrKB64KosJVZMGQHdbUGX6VtOHnMHZvW12v9B5Yx7nWvsaB_I8WaGDHnB3kvUaP-wKyaba0nvZCGYbkFfQQ9Xjumd6ZIxwRz8_Eiq6UUC1DfCRrGgJH19xwlJ0RtqXozYh9YpCdT8AvQ"
                width={500}
                height={500}
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
              I bring a unique blend of systematic backend logic and creative
              frontend flair. I don&apos;t just write code; I build sustainable,
              scalable digital products that solve real business problems. My
              approach is user-centric and performance-obsessed.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  600+
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Commits this year
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  50+
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tech Stack Mastered
                </p>
              </div>
            </div>

            <Button href="#contact" variant="outline">
              Hire Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
