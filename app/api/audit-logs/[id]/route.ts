import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/db/models/auditLog.model";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid audit log ID" },
                { status: 400 }
            );
        }

        const log = await AuditLog.findById(id).lean();

        if (!log) {
            return NextResponse.json(
                { error: "Audit log not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(log);
    } catch (error) {
        console.error("Error fetching audit log:", error);
        return NextResponse.json(
            { error: "Failed to fetch audit log" },
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
                { error: "Invalid audit log ID" },
                { status: 400 }
            );
        }

        // Hard delete for audit logs (or could be soft delete if schema supports it, but typical for logs is archival or hard delete)
        // Checking schema: AuditLogSchema in existing codebase doesn't seem to have deletedAt explicitly in the snippet I saw earlier, 
        // but typically logs are just deleted. 
        // Re-checking the snippet from step 89: It DOES NOT have 'deletedAt' in the interface or schema.
        // So I will use findByIdAndDelete.

        const log = await AuditLog.findByIdAndDelete(id).lean();

        if (!log) {
            return NextResponse.json(
                { error: "Audit log not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Audit log deleted successfully" });
    } catch (error) {
        console.error("Error deleting audit log:", error);
        return NextResponse.json(
            { error: "Failed to delete audit log" },
            { status: 500 }
        );
    }
}
