import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { slug } = await params;

        const post = await BlogPost.findOne({
            slug,
            deletedAt: null,
        }).lean();

        if (!post) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog post" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { slug } = await params;
        const body = await request.json();

        // Don't allow changing slug through update
        delete body.slug;

        const post = await BlogPost.findOneAndUpdate(
            { slug, deletedAt: null },
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!post) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 }
            );
        }

        // Fetch original document for diff (optional but good for 'before' state)
        // Since findOneAndUpdate returns the NEW document by default with {new: true}, 
        // we might miss 'before' unless we fetched it or used {new: false}.
        // For simplicity here, we log the result. If precise diff needed, fetch before.

        await logActivity({
            action: "UPDATE",
            targetCollection: "blog_posts",
            documentId: post._id,
            userEmail: "admin@portfolio.local",
            changes: { after: post },
            req: request,
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json(
            { error: "Failed to update blog post" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { slug } = await params;

        // Soft delete
        const post = await BlogPost.findOneAndUpdate(
            { slug, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        ).lean();

        if (!post) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "DELETE",
            targetCollection: "blog_posts",
            documentId: post._id,
            userEmail: "admin@portfolio.local",
            changes: { before: post },
            req: request,
        });

        return NextResponse.json({ message: "Blog post deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json(
            { error: "Failed to delete blog post" },
            { status: 500 }
        );
    }
}
