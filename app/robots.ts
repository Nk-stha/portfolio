import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nikeshshrestha405.com.np';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/admin/'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
