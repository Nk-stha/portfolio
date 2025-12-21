import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/db/mongoose';
import { BlogPost, Project } from '@/lib/db/models';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nikeshshrestha405.com.np';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    try {
        await connectToDatabase();

        // Dynamic blog posts
        const blogPosts = await BlogPost.find({
            deletedAt: null,
            publishedAt: { $ne: null, $lte: new Date() },
        })
            .select('slug updatedAt')
            .lean();

        const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        // Dynamic projects
        const projects = await Project.find({
            deletedAt: null,
        })
            .select('_id updatedAt')
            .lean();

        const projectRoutes: MetadataRoute.Sitemap = projects.map((project: any) => ({
            url: `${BASE_URL}/projects/${project._id}`,
            lastModified: project.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

        return [...staticRoutes, ...blogRoutes, ...projectRoutes];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        // Return static routes if DB fails
        return staticRoutes;
    }
}
