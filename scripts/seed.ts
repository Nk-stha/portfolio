/**
 * Database Seed Script
 *
 * Migrates static data from portfolio-data.ts into MongoDB collections.
 *
 * Usage (inside Docker container):
 *   docker-compose exec portfolio npm run db:seed
 *
 * Usage (local with .env file):
 *   npm run db:seed
 *
 * Prerequisites:
 *   1. MongoDB running (via docker-compose)
 *   2. MONGODB_URI environment variable set in .env
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env (Docker Compose default)
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Import models
import { Profile } from "../lib/db/models/profile.model";
import { ProcessStep } from "../lib/db/models/processStep.model";
import { Experience } from "../lib/db/models/experience.model";
import { Project } from "../lib/db/models/project.model";
import { Testimonial } from "../lib/db/models/testimonial.model";
import { BlogPost } from "../lib/db/models/blogPost.model";

// Import static data
import {
    NAV_LINKS,
    PROCESS_STEPS,
    EXPERIENCES,
    PROJECTS,
    TESTIMONIALS,
    BLOG_POSTS,
    SOCIAL_LINKS,
    FOOTER_NAV,
} from "../lib/constants/portfolio-data";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in environment variables");
    console.log("Please create a .env file (copy from .env.example):");
    console.log("cp .env.example .env");
    process.exit(1);
}

async function seed() {
    console.log("🌱 Starting database seed...\n");

    try {
        // Connect to MongoDB
        console.log("📡 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!);
        console.log("✅ Connected to MongoDB\n");

        // Clear existing data
        console.log("🧹 Clearing existing data...");
        await Promise.all([
            Profile.deleteMany({}),
            ProcessStep.deleteMany({}),
            Experience.deleteMany({}),
            Project.deleteMany({}),
            Testimonial.deleteMany({}),
            BlogPost.deleteMany({}),
        ]);
        console.log("✅ Cleared existing data\n");

        // 1. Seed Profile
        console.log("👤 Seeding Profile...");
        await Profile.create({
            name: "Rohan Shrestha",
            title: "Full Stack Engineer",
            email: "hello@rohandev.com",
            phone: "98000000",
            website: "www.rohandev.com",
            avatarUrl: "/animatedprofile.png",
            hero: {
                greeting: "Hello!",
                tagline:
                    "Rohan's robust code architecture scaled our platform to millions of users seamlessly.",
                yearsExperience: 2,
                projectsShipped: 10,
            },
            about: {
                headline:
                    "Why You Hire Me for Your Next Project?",
                description:
                    "I bring a unique blend of systematic backend logic and creative frontend flair. I don't just write code; I build sustainable, scalable digital products that solve real business problems. My approach is user-centric and performance-obsessed.",
                stats: [
                    { label: "Commits this year", value: "600+" },
                    { label: "Tech Stack Mastered", value: "50+" },
                ],
            },
            navLinks: NAV_LINKS,
            socialLinks: SOCIAL_LINKS,
            footerNav: FOOTER_NAV,
            seo: {
                title: "Rohan Shrestha - Full Stack Engineer Portfolio",
                description:
                    "Passionate Full Stack Engineer dedicated to building high-quality, scalable web applications. 10+ years of experience in React, Node.js, and cloud infrastructure.",
                keywords: [
                    "Full Stack Developer",
                    "React",
                    "Next.js",
                    "Node.js",
                    "Portfolio",
                    "Web Development",
                ],
                ogImage: "/animatedprofile.png",
            },
        });
        console.log("✅ Profile seeded\n");

        // 2. Seed Process Steps
        console.log("⚙️ Seeding Process Steps...");
        const processStepsData = PROCESS_STEPS.map((step) => ({
            order: step.id,
            icon: step.icon,
            title: step.title,
            description: step.description,
            items: step.items,
            isActive: true,
        }));
        await ProcessStep.insertMany(processStepsData);
        console.log(`✅ ${processStepsData.length} Process Steps seeded\n`);

        // 3. Seed Experiences
        console.log("💼 Seeding Experiences...");
        const experiencesData = EXPERIENCES.map((exp, index) => {
            // Parse period string to dates
            const [startStr, endStr] = exp.period.split(" - ");
            const startDate = new Date(startStr);
            const endDate = endStr.toLowerCase() === "present" ? null : new Date(endStr);

            return {
                company: exp.company,
                role: exp.role,
                description: exp.description,
                startDate,
                endDate,
                isPrimary: exp.isPrimary || false,
                order: index + 1,
                companyLogo: null,
                companyUrl: null,
                deletedAt: null,
            };
        });
        await Experience.insertMany(experiencesData);
        console.log(`✅ ${experiencesData.length} Experiences seeded\n`);

        // 4. Seed Projects
        console.log("🚀 Seeding Projects...");
        const projectsData = PROJECTS.map((project, index) => ({
            title: project.title,
            description: project.description,
            image: project.image,
            images: [],
            category: project.category,
            tags: project.tags,
            techStack: project.description.split(", "), // Extract from description
            liveUrl: null,
            sourceUrl: null,
            caseStudyUrl: null,
            isFeatured: index === 0,
            order: index + 1,
            deletedAt: null,
        }));
        await Project.insertMany(projectsData);
        console.log(`✅ ${projectsData.length} Projects seeded\n`);

        // 5. Seed Testimonials
        console.log("💬 Seeding Testimonials...");
        const testimonialsData = TESTIMONIALS.map((testimonial, index) => ({
            author: {
                name: testimonial.name,
                role: testimonial.role,
                company: testimonial.company,
                image: testimonial.image,
            },
            quote: testimonial.quote,
            rating: testimonial.rating,
            isPrimary: testimonial.isPrimary || false,
            order: index + 1,
            isActive: true,
            deletedAt: null,
        }));
        await Testimonial.insertMany(testimonialsData);
        console.log(`✅ ${testimonialsData.length} Testimonials seeded\n`);

        // 6. Seed Blog Posts
        console.log("📝 Seeding Blog Posts...");
        const blogPostsData = BLOG_POSTS.map((post, index) => {
            // Create slug from title
            const slug = post.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            return {
                slug,
                title: post.title,
                category: post.category,
                content: "", // No content in static data
                excerpt: `A deep dive into ${post.title.toLowerCase()}.`,
                featuredImage: post.image,
                author: {
                    name: post.author,
                    avatar: "/animatedprofile.png",
                },
                publishedAt: new Date(post.date),
                metaTitle: post.title,
                metaDescription: `Read about ${post.title}`,
                isFeatured: post.isPrimary || false,
                deletedAt: null,
            };
        });
        await BlogPost.insertMany(blogPostsData);
        console.log(`✅ ${blogPostsData.length} Blog Posts seeded\n`);

        // Summary
        console.log("🎉 Database seeding complete!");
        console.log("─".repeat(40));
        console.log("Summary:");
        console.log(`  • Profile: 1 document`);
        console.log(`  • Process Steps: ${processStepsData.length} documents`);
        console.log(`  • Experiences: ${experiencesData.length} documents`);
        console.log(`  • Projects: ${projectsData.length} documents`);
        console.log(`  • Testimonials: ${testimonialsData.length} documents`);
        console.log(`  • Blog Posts: ${blogPostsData.length} documents`);
        console.log("─".repeat(40));
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n📡 Disconnected from MongoDB");
    }
}

// Run the seed function
seed();
