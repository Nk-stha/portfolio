import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");

        // Build query
        const query: Record<string, unknown> = { deletedAt: null };

        if (category && category !== "all") {
            query.category = category;
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        const projects = await Project.find(query).sort({ order: 1 }).lean();

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.category || !body.image) {
            return NextResponse.json(
                { error: "Missing required fields: title, category, image" },
                { status: 400 }
            );
        }

        // Get the next order number
        const lastProject = await Project.findOne().sort({ order: -1 });
        const order = lastProject ? lastProject.order + 1 : 1;

        const project = await Project.create({
            ...body,
            order,
        });

        await logActivity({
            action: "CREATE",
            targetCollection: "projects",
            documentId: (project as any)._id,
            userEmail: "admin@portfolio.local",
            changes: { after: (project as any).toObject() },
            req: request,
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
