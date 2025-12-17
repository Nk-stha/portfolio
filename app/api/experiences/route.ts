import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Experience } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

export async function GET() {
    try {
        await connectToDatabase();

        // Get non-deleted experiences, ordered
        const experiences = await Experience.find({ deletedAt: null })
            .sort({ order: 1 })
            .lean();

        return NextResponse.json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return NextResponse.json(
            { error: "Failed to fetch experiences" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.company || !body.period) {
            return NextResponse.json(
                { error: "Missing required fields: title, company, period" },
                { status: 400 }
            );
        }

        // Get the next order number
        const lastExperience = await Experience.findOne().sort({ order: -1 });
        const order = lastExperience ? lastExperience.order + 1 : 1;

        const experience = await Experience.create({
            ...body,
            order,
        });

        await logActivity({
            action: "CREATE",
            targetCollection: "experiences",
            documentId: (experience as any)._id,
            userEmail: "admin@portfolio.local",
            changes: { after: (experience as any).toObject() },
            req: request,
        });

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error("Error creating experience:", error);
        return NextResponse.json(
            { error: "Failed to create experience" },
            { status: 500 }
        );
    }
}
