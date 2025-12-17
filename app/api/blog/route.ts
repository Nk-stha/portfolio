import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        // Build query - only published posts
        const query: Record<string, unknown> = {
            deletedAt: null,
            publishedAt: { $lte: new Date() },
        };

        if (category) {
            query.category = category;
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        const posts = await BlogPost.find(query)
            .sort({ publishedAt: -1 })
            .limit(limit)
            .select("-content") // Exclude full content for list view
            .lean();

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.slug || !body.category || !body.featuredImage) {
            return NextResponse.json(
                { error: "Missing required fields: title, slug, category, featuredImage" },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingPost = await BlogPost.findOne({ slug: body.slug });
        if (existingPost) {
            return NextResponse.json(
                { error: "A post with this slug already exists" },
                { status: 409 }
            );
        }

        const post = await BlogPost.create({
            ...body,
            author: body.author || { name: "Rohan Shrestha", avatar: "/animatedprofile.png" },
        });

        await logActivity({
            action: "CREATE",
            targetCollection: "blog_posts",
            documentId: (post as any)._id,
            userEmail: "admin@portfolio.local", // Placeholder as no auth system detected
            changes: { after: (post as any).toObject() },
            req: request,
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json(
            { error: "Failed to create blog post" },
            { status: 500 }
        );
    }
}
