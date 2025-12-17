import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Experience } from "@/lib/db/models";
import mongoose from "mongoose";
import { logActivity } from "@/lib/utils/audit-logger";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid experience ID" },
                { status: 400 }
            );
        }

        const experience = await Experience.findOne({
            _id: id,
            deletedAt: null,
        }).lean();

        if (!experience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(experience);
    } catch (error) {
        console.error("Error fetching experience:", error);
        return NextResponse.json(
            { error: "Failed to fetch experience" },
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
                { error: "Invalid experience ID" },
                { status: 400 }
            );
        }

        const experience = await Experience.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!experience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "UPDATE",
            targetCollection: "experiences",
            documentId: experience._id,
            userEmail: "admin@portfolio.local",
            changes: { after: experience },
            req: request,
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error("Error updating experience:", error);
        return NextResponse.json(
            { error: "Failed to update experience" },
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
                { error: "Invalid experience ID" },
                { status: 400 }
            );
        }

        // Soft delete
        const experience = await Experience.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        ).lean();

        if (!experience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "DELETE",
            targetCollection: "experiences",
            documentId: experience._id,
            userEmail: "admin@portfolio.local",
            changes: { before: experience },
            req: request,
        });

        return NextResponse.json({ message: "Experience deleted successfully" });
    } catch (error) {
        console.error("Error deleting experience:", error);
        return NextResponse.json(
            { error: "Failed to delete experience" },
            { status: 500 }
        );
    }
}
