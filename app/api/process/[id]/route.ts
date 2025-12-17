import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProcessStep } from "@/lib/db/models";
import mongoose from "mongoose";
import { logActivity } from "@/lib/utils/audit-logger";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid process step ID" },
                { status: 400 }
            );
        }

        const step = await ProcessStep.findById(id).lean();

        if (!step) {
            return NextResponse.json(
                { error: "Process step not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(step);
    } catch (error) {
        console.error("Error fetching process step:", error);
        return NextResponse.json(
            { error: "Failed to fetch process step" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid process step ID" },
                { status: 400 }
            );
        }

        const step = await ProcessStep.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!step) {
            return NextResponse.json(
                { error: "Process step not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "UPDATE",
            targetCollection: "process_steps",
            documentId: step._id,
            userEmail: "admin@portfolio.local",
            changes: { after: step },
            req: request,
        });

        return NextResponse.json(step);
    } catch (error) {
        console.error("Error updating process step:", error);
        return NextResponse.json(
            { error: "Failed to update process step" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid process step ID" },
                { status: 400 }
            );
        }

        // Hard delete for process steps
        const step = await ProcessStep.findByIdAndDelete(id).lean();

        if (!step) {
            return NextResponse.json(
                { error: "Process step not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "DELETE",
            targetCollection: "process_steps",
            documentId: step._id,
            userEmail: "admin@portfolio.local",
            changes: { before: step },
            req: request,
        });

        return NextResponse.json({ message: "Process step deleted successfully" });
    } catch (error) {
        console.error("Error deleting process step:", error);
        return NextResponse.json(
            { error: "Failed to delete process step" },
            { status: 500 }
        );
    }
}
