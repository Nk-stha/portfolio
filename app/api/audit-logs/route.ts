import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/db/models/auditLog.model";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        // Filtering
        const targetCollection = searchParams.get("targetCollection");
        const action = searchParams.get("action");
        const userId = searchParams.get("userId");

        // Build query
        const query: Record<string, unknown> = {};

        if (targetCollection) {
            query.targetCollection = targetCollection;
        }

        if (action) {
            query.action = action;
        }

        if (userId) {
            query.userId = userId;
        }

        // Execute query
        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(query),
        ]);

        return NextResponse.json({
            data: logs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch audit logs" },
            { status: 500 }
        );
    }
}
