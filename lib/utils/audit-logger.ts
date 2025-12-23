import { AuditLog } from "@/lib/db/models/auditLog.model";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Types } from "mongoose";

interface LogActivityParams {
    action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
    targetCollection: string;
    documentId: string | Types.ObjectId;
    userId?: string | Types.ObjectId | null;
    userEmail: string;
    changes?: {
        before?: any;
        after?: any;
    };
    req?: Request; // Optional request object to extract IP/UserAgent
}

export async function logActivity({
    action,
    targetCollection,
    documentId,
    userId = null,
    userEmail,
    changes = {},
    req,
}: LogActivityParams) {
    try {
        // Ensure database connection
        await connectToDatabase();

        let ipAddress = "";
        let userAgent = "";

        if (req) {
            ipAddress =
                req.headers.get("x-forwarded-for") ||
                req.headers.get("cf-connecting-ip") ||
                "unknown";
            userAgent = req.headers.get("user-agent") || "unknown";
        }

        await AuditLog.create({
            action,
            targetCollection,
            documentId,
            userId,
            userEmail,
            changes,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        // Fail silently to not block the main request
        // console.error("Audit log failed");
    }
}
