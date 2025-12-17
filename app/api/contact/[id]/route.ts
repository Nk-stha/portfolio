import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContactSubmission } from "@/lib/db/models";
import mongoose from "mongoose";
import { logActivity } from "@/lib/utils/audit-logger";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid submission ID" },
                { status: 400 }
            );
        }

        const submission = await ContactSubmission.findById(id).lean();

        if (!submission) {
            return NextResponse.json(
                { error: "Contact submission not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(submission);
    } catch (error) {
        console.error("Error fetching contact submission:", error);
        return NextResponse.json(
            { error: "Failed to fetch contact submission" },
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
                { error: "Invalid submission ID" },
                { status: 400 }
            );
        }

        const submission = await ContactSubmission.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!submission) {
            return NextResponse.json(
                { error: "Contact submission not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "UPDATE",
            targetCollection: "contact_submissions",
            documentId: submission._id,
            userEmail: "admin@portfolio.local",
            changes: { after: submission },
            req: request,
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.error("Error updating contact submission:", error);
        return NextResponse.json(
            { error: "Failed to update contact submission" },
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
                { error: "Invalid submission ID" },
                { status: 400 }
            );
        }

        const submission = await ContactSubmission.findByIdAndDelete(id).lean();

        if (!submission) {
            return NextResponse.json(
                { error: "Contact submission not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "DELETE",
            targetCollection: "contact_submissions",
            documentId: submission._id,
            userEmail: "admin@portfolio.local",
            changes: { before: submission },
            req: request,
        });

        return NextResponse.json({ message: "Contact submission deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact submission:", error);
        return NextResponse.json(
            { error: "Failed to delete contact submission" },
            { status: 500 }
        );
    }
}
