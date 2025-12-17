import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProcessStep } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

export async function GET() {
    try {
        await connectToDatabase();

        // Get active process steps, ordered
        const steps = await ProcessStep.find({ isActive: true })
            .sort({ order: 1 })
            .lean();

        return NextResponse.json(steps);
    } catch (error) {
        console.error("Error fetching process steps:", error);
        return NextResponse.json(
            { error: "Failed to fetch process steps" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.icon) {
            return NextResponse.json(
                { error: "Missing required fields: title, icon" },
                { status: 400 }
            );
        }

        // Get the next order number
        const lastStep = await ProcessStep.findOne().sort({ order: -1 });
        const order = lastStep ? lastStep.order + 1 : 1;

        const step = await ProcessStep.create({
            ...body,
            order,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });

        await logActivity({
            action: "CREATE",
            targetCollection: "process_steps",
            documentId: (step as any)._id,
            userEmail: "admin@portfolio.local",
            changes: { after: (step as any).toObject() },
            req: request,
        });

        return NextResponse.json(step, { status: 201 });
    } catch (error) {
        console.error("Error creating process step:", error);
        return NextResponse.json(
            { error: "Failed to create process step" },
            { status: 500 }
        );
    }
}
