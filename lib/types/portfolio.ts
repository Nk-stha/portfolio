// Type definitions for portfolio data structures

export interface NavLink {
    label: string;
    href: string;
}

export interface ProcessStep {
    _id: string;
    order: number;
    icon: string;
    title: string;
    description: string;
    items: string[];
    isActive: boolean;
}

export interface Experience {
    _id: string;
    company: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string | null;
    period: string; // Virtual field from backend
    isPrimary: boolean;
    order: number;
    companyLogo: string | null;
    companyUrl: string | null;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    image: string;
    images: string[];
    category: "saas" | "ecommerce" | "mobile" | "web";
    tags: string[];
    techStack: string[];
    liveUrl: string | null;
    sourceUrl: string | null;
    caseStudyUrl: string | null;
    isFeatured: boolean;
    order: number;
}

export interface Testimonial {
    _id: string;
    author: {
        name: string;
        role: string;
        company: string;
        image: string;
    };
    quote: string;
    rating: number;
    isPrimary: boolean;
    order: number;
    isActive: boolean;
}

export interface BlogPost {
    _id: string;
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    featuredImage: string;
    author: {
        name: string;
        avatar: string;
    };
    publishedAt: string;
    isFeatured: boolean;
}

// Input types for static data (portfolio-data.ts)
export interface ProcessStepInput {
    id: number;
    icon: string;
    title: string;
    description: string;
    items: string[];
}

export interface ExperienceInput {
    id: number;
    company: string;
    role: string;
    description: string;
    period: string;
    isPrimary?: boolean;
}

export interface ProjectInput {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    category: "saas" | "ecommerce" | "mobile" | "web";
}

export interface TestimonialInput {
    id: number;
    name: string;
    role: string;
    company: string;
    image: string;
    quote: string;
    rating: number;
    isPrimary?: boolean;
}

export interface BlogPostInput {
    id: number;
    title: string;
    category: string;
    image: string;
    author: string;
    date: string;
    isPrimary?: boolean;
}

export interface SocialLink {
    platform: string;
    icon: string;
    href: string;
}

export interface ProfileStats {
    label: string;
    value: string;
}

export interface Profile {
    _id: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    website: string;
    avatarUrl: string;
    hero: {
        greeting: string;
        tagline: string;
        yearsExperience: number;
        projectsShipped: number;
    };
    about: {
        headline: string;
        description: string;
        stats: ProfileStats[];
    };
    navLinks: NavLink[];
    socialLinks: SocialLink[];
    footerNav: NavLink[];
    seo: {
        title: string;
        description: string;
        keywords: string[];
        ogImage: string;
    };
}
