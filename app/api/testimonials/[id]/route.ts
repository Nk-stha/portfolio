import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Testimonial } from "@/lib/db/models";
import mongoose from "mongoose";
import { logActivity } from "@/lib/utils/audit-logger";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid testimonial ID" },
                { status: 400 }
            );
        }

        const testimonial = await Testimonial.findOne({
            _id: id,
            deletedAt: null,
        }).lean();

        if (!testimonial) {
            return NextResponse.json(
                { error: "Testimonial not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Error fetching testimonial:", error);
        return NextResponse.json(
            { error: "Failed to fetch testimonial" },
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
                { error: "Invalid testimonial ID" },
                { status: 400 }
            );
        }

        const testimonial = await Testimonial.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!testimonial) {
            return NextResponse.json(
                { error: "Testimonial not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "UPDATE",
            targetCollection: "testimonials",
            documentId: testimonial._id,
            userEmail: "admin@portfolio.local",
            changes: { after: testimonial },
            req: request,
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return NextResponse.json(
            { error: "Failed to update testimonial" },
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
                { error: "Invalid testimonial ID" },
                { status: 400 }
            );
        }

        // Soft delete
        const testimonial = await Testimonial.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        ).lean();

        if (!testimonial) {
            return NextResponse.json(
                { error: "Testimonial not found" },
                { status: 404 }
            );
        }

        await logActivity({
            action: "DELETE",
            targetCollection: "testimonials",
            documentId: testimonial._id,
            userEmail: "admin@portfolio.local",
            changes: { before: testimonial },
            req: request,
        });

        return NextResponse.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json(
            { error: "Failed to delete testimonial" },
            { status: 500 }
        );
    }
}
