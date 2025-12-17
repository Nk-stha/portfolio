// Force dynamic rendering - this page fetches from DB at runtime
export const dynamic = 'force-dynamic';

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
import { connectToDatabase } from "@/lib/db/mongoose";
import { 
  Profile, 
  ProcessStep, 
  Experience, 
  Project, 
  Testimonial, 
  BlogPost 
} from "@/lib/db/models";

async function getData() {
  await connectToDatabase();
  
  const [profile, processSteps, experiences, projects, testimonials, blogPosts] = await Promise.all([
    Profile.findOne({}).lean(),
    ProcessStep.find({ isActive: true }).sort({ order: 1 }).lean(),
    Experience.find({ deletedAt: null }).sort({ order: 1 }).lean(),
    Project.find({ deletedAt: null, isFeatured: true }).sort({ order: 1 }).lean(),
    Testimonial.find({ deletedAt: null, isActive: true }).sort({ order: 1 }).lean(),
    BlogPost.find({ deletedAt: null, publishedAt: { $lt: new Date() } })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean()
  ]);

  return {
    profile: JSON.parse(JSON.stringify(profile || {})),
    processSteps: JSON.parse(JSON.stringify(processSteps || [])),
    experiences: JSON.parse(JSON.stringify(experiences || [])),
    projects: JSON.parse(JSON.stringify(projects || [])),
    testimonials: JSON.parse(JSON.stringify(testimonials || [])),
    blogPosts: JSON.parse(JSON.stringify(blogPosts || [])),
  };
}

export default async function Home() {
  const { 
    profile, 
    processSteps, 
    experiences, 
    projects, 
    testimonials, 
    blogPosts 
  } = await getData();

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 antialiased overflow-x-hidden">
      <Header profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <ProcessSection steps={processSteps} />
        <ExperienceSection experiences={experiences} />
        <AboutSection profile={profile} />
        <PortfolioSection projects={projects} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection />
        <ScrollingBanner />
        <BlogSection posts={blogPosts} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
