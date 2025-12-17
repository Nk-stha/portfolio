import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Testimonial } from "@/lib/db/models";
import { logActivity } from "@/lib/utils/audit-logger";

export async function GET() {
    try {
        await connectToDatabase();

        // Get active, non-deleted testimonials
        const testimonials = await Testimonial.find({
            isActive: true,
            deletedAt: null,
        })
            .sort({ order: 1 })
            .lean();

        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json(
            { error: "Failed to fetch testimonials" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.title || !body.company || !body.content) {
            return NextResponse.json(
                { error: "Missing required fields: name, title, company, content" },
                { status: 400 }
            );
        }

        // Get the next order number
        const lastTestimonial = await Testimonial.findOne().sort({ order: -1 });
        const order = lastTestimonial ? lastTestimonial.order + 1 : 1;

        const testimonial = await Testimonial.create({
            ...body,
            order,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });

        await logActivity({
            action: "CREATE",
            targetCollection: "testimonials",
            documentId: (testimonial as any)._id,
            userEmail: "admin@portfolio.local",
            changes: { after: (testimonial as any).toObject() },
            req: request,
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return NextResponse.json(
            { error: "Failed to create testimonial" },
            { status: 500 }
        );
    }
}
