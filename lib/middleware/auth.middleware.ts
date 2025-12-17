import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

/**
 * Middleware helper to verify admin authentication
 * Use this in API routes that require authentication
 */
export async function requireAuth(request: NextRequest): Promise<{
    isAuthorized: boolean;
    adminId?: string;
    email?: string;
    role?: string;
    response?: NextResponse;
}> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return {
            isAuthorized: false,
            response: NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            ),
        };
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return {
            isAuthorized: false,
            response: NextResponse.json(
                { error: "Unauthorized - Invalid or expired token" },
                { status: 401 }
            ),
        };
    }

    return {
        isAuthorized: true,
        adminId: decoded.adminId,
        email: decoded.email,
        role: decoded.role,
    };
}

/**
 * Middleware helper to require super admin role
 */
export async function requireSuperAdmin(request: NextRequest): Promise<{
    isAuthorized: boolean;
    adminId?: string;
    email?: string;
    response?: NextResponse;
}> {
    const authCheck = await requireAuth(request);

    if (!authCheck.isAuthorized) {
        return authCheck;
    }

    if (authCheck.role !== "super_admin") {
        return {
            isAuthorized: false,
            response: NextResponse.json(
                { error: "Forbidden - Super admin access required" },
                { status: 403 }
            ),
        };
    }

    return {
        isAuthorized: true,
        adminId: authCheck.adminId,
        email: authCheck.email,
    };
}
