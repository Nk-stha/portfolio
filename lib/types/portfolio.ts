// Type definitions for portfolio data structures

export interface NavLink {
    label: string;
    href: string;
}

export interface ProcessStep {
    id: number;
    icon: string;
    title: string;
    description: string;
    items: string[];
}

export interface Experience {
    id: number;
    company: string;
    period: string;
    role: string;
    description: string;
    isPrimary?: boolean;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    category: 'saas' | 'ecommerce' | 'mobile' | 'all';
}

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    image: string;
    rating: number;
    quote: string;
    isPrimary?: boolean;
}

export interface BlogPost {
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
