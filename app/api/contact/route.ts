import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ContactSubmission } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";
import { requireAuth } from "@/lib/middleware/auth.middleware";
// Simple email validation
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        // 1. Authorization check
        const authResult = await requireAuth(request);
        if (!authResult.isAuthorized) {
            return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const submissions = await ContactSubmission.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Error fetching contact submissions:", error);
        return NextResponse.json(
            { error: "Failed to fetch contact submissions" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        /**
         * NOTE: This POST endpoint is explicitly excluded from Bearer token protection in middleware.ts
         * to allow public users to submit contact forms. 
         * Security measures include:
         * - IP-based audit logging
         * - Future: Consider adding rate-limiting and reCAPTCHA here.
         */
        const body = await request.json();
        const { email, name, message, source = "contact_form" } = body;

        // Validation
        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        // Get IP address for spam protection
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ipAddress = forwardedFor
            ? forwardedFor.split(",")[0].trim()
            : request.headers.get("x-real-ip") || "unknown";

        // Get referrer
        const referrer = request.headers.get("referer") || null;

        // Create submission
        const submission = await ContactSubmission.create({
            email,
            name: name || null,
            message: message || null,
            source,
            referrer,
            status: "new",
            ipAddress,
        });

        await logActivity({
            action: "CREATE",
            targetCollection: "contact_submissions",
            documentId: submission._id,
            userEmail: email, // Use the submitter's email for contact form
            changes: { after: submission.toObject() },
            req: request,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Thank you for your message! I'll get back to you soon.",
                id: submission._id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating contact submission:", error);
        return NextResponse.json(
            { error: "Failed to submit contact form" },
            { status: 500 }
        );
    }
}
