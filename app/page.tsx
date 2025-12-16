import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ScrollingBanner } from "@/components/sections/ScrollingBanner";
import { BlogSection } from "@/components/sections/BlogSection";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 antialiased overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <ProcessSection />
        <ExperienceSection />
        <AboutSection />
        <PortfolioSection />
        <TestimonialsSection />
        <ContactSection />
        <ScrollingBanner />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
