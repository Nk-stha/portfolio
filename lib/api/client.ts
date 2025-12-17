// API client functions for fetching portfolio data

import type {
    Profile,
    ProcessStep,
    Experience,
    Project,
    Testimonial,
    BlogPost,
} from "@/lib/types/portfolio";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }

    return res.json();
}

/**
 * Fetch the singleton profile
 */
export async function getProfile(): Promise<Profile> {
    return fetchAPI<Profile>("/api/profile");
}

/**
 * Fetch all active process steps
 */
export async function getProcessSteps(): Promise<ProcessStep[]> {
    return fetchAPI<ProcessStep[]>("/api/process");
}

/**
 * Fetch all experiences
 */
export async function getExperiences(): Promise<Experience[]> {
    return fetchAPI<Experience[]>("/api/experiences");
}

/**
 * Fetch projects with optional filters
 */
export async function getProjects(options?: {
    category?: string;
    featured?: boolean;
}): Promise<Project[]> {
    const params = new URLSearchParams();

    if (options?.category) {
        params.set("category", options.category);
    }

    if (options?.featured) {
        params.set("featured", "true");
    }

    const query = params.toString();
    return fetchAPI<Project[]>(`/api/projects${query ? `?${query}` : ""}`);
}

/**
 * Fetch active testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
    return fetchAPI<Testimonial[]>("/api/testimonials");
}

/**
 * Fetch published blog posts
 */
export async function getBlogPosts(options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
}): Promise<BlogPost[]> {
    const params = new URLSearchParams();

    if (options?.category) {
        params.set("category", options.category);
    }

    if (options?.featured) {
        params.set("featured", "true");
    }

    if (options?.limit) {
        params.set("limit", options.limit.toString());
    }

    const query = params.toString();
    return fetchAPI<BlogPost[]>(`/api/blog${query ? `?${query}` : ""}`);
}

/**
 * Submit contact form
 */
export async function submitContact(data: {
    email: string;
    name?: string;
    message?: string;
    source?: "contact_form" | "newsletter" | "hire_button";
}): Promise<{ success: boolean; message: string; id: string }> {
    const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit contact form");
    }

    return res.json();
}
