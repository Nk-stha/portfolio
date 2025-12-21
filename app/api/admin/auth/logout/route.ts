import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { RefreshToken, AuditLog } from "@/lib/db/models";
import { verifyRefreshToken } from "@/lib/auth/jwt";

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
        const refreshTokenCookie = request.cookies.get("refreshToken")?.value;

        if (!refreshTokenCookie) {
            return NextResponse.json(
                { error: "No active session found" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Decode token to get admin info (even if expired)
        const decoded = verifyRefreshToken(refreshTokenCookie);

        // Revoke the refresh token in database
        const result = await RefreshToken.updateOne(
            { token: refreshTokenCookie },
            { $set: { isRevoked: true } }
        );

        // Log logout
        if (decoded) {
            await AuditLog.create({
                action: "LOGOUT",
                targetCollection: "admin_auth",
                documentId: decoded.adminId,
                userId: decoded.adminId,
                userEmail: decoded.email,
                changes: { ipAddress, tokensRevoked: result.modifiedCount, userName: decoded.email },
            });
        }

        // Clear cookies
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });

        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);

        return NextResponse.json(
            { error: "An error occurred during logout" },
            { status: 500 }
        );
    }
}
