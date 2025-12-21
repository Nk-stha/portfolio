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
        console.log("Revoking refresh token in DB...");
        const result = await RefreshToken.updateOne(
            { token: refreshTokenCookie },
            { $set: { isRevoked: true } }
        );
        console.log("RefreshToken update result:", result);

        // Log logout
        if (decoded) {
            console.log("Creating AuditLog for user:", decoded.adminId);

            try {
                await AuditLog.create({
                    action: "LOGOUT",
                    targetCollection: "admin_auth",
                    documentId: decoded.adminId,
                    userId: decoded.adminId,
                    userEmail: decoded.email,
                    changes: { ipAddress, tokensRevoked: result.modifiedCount, userName: decoded.email },
                });
                console.log("AuditLog created successfully");
            } catch (auditError) {
                console.error("AuditLog creation failed (non-fatal)");
                // Don't fail the request just because logging failed, but log it
            }
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
        console.error("Logout error occurred");

        // Return more specific error in dev only
        const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : "An error occurred during logout";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
