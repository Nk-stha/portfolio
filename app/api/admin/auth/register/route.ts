import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AdminUser, AuditLog } from "@/lib/db/models";
import { hashPassword } from "@/lib/auth/password";
import { validateAdminData } from "@/lib/auth/validation";
import { verifyAccessToken } from "@/lib/auth/jwt";

function getClientIp(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

export async function POST(request: NextRequest) {
    const ipAddress = getClientIp(request);

    try {
        // Verify admin authorization
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid or expired access token" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Check if the requesting admin has super_admin role
        const requestingAdmin = await AdminUser.findById(decoded.adminId);
        if (!requestingAdmin || requestingAdmin.role !== "super_admin") {
            await AuditLog.create({
                action: "CREATE",
                targetCollection: "admin_user",
                userId: decoded.adminId,
                userEmail: decoded.email,
                changes: { ipAddress, reason: "insufficient_permissions", userName: decoded.email },
            });

            return NextResponse.json(
                { error: "Only super admins can create new admin accounts" },
                { status: 403 }
            );
        }

        // Parse request body
        const { email, password, name, role } = await request.json();

        // Validate input
        const validation = validateAdminData({ email, password, name });
        if (!validation.isValid) {
            return NextResponse.json(
                { error: "Validation failed", errors: validation.errors },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingAdmin = await AdminUser.findOne({
            email: email.toLowerCase(),
        });

        if (existingAdmin) {
            return NextResponse.json(
                { error: "Admin with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin user
        const newAdmin = await AdminUser.create({
            email: email.toLowerCase(),
            passwordHash,
            name,
            role: role === "super_admin" ? "super_admin" : "admin",
            isActive: true,
            loginAttempts: 0,
        });

        // Log admin creation
        await AuditLog.create({
            action: "CREATE",
            targetCollection: "admin_user",
            documentId: newAdmin._id.toString(),
            userId: decoded.adminId,
            userEmail: decoded.email,
            changes: {
                ipAddress,
                newAdminEmail: newAdmin.email,
                newAdminRole: newAdmin.role,
                userName: decoded.email
            },
        });

        return NextResponse.json({
            success: true,
            admin: {
                id: newAdmin._id.toString(),
                email: newAdmin.email,
                name: newAdmin.name,
                role: newAdmin.role,
                isActive: newAdmin.isActive,
            },
        });
    } catch (error) {
        console.error("Admin registration error:", error);

        return NextResponse.json(
            { error: "An error occurred during admin registration" },
            { status: 500 }
        );
    }
}
