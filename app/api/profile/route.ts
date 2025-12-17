import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Profile } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

export async function GET() {
    try {
        await connectToDatabase();

        // Get the singleton profile (first document)
        const profile = await Profile.findOne().lean();

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // Find and update the singleton profile, or create if doesn't exist
        const profile = await Profile.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true, runValidators: true }
        ).lean();

        await logActivity({
            action: "UPDATE",
            targetCollection: "profile",
            documentId: profile._id,
            userEmail: "admin@portfolio.local",
            changes: { after: profile },
            req: request,
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
