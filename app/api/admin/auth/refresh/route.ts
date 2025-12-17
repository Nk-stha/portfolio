import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { RefreshToken, AuditLog } from "@/lib/db/models";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";

function getClientIp(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

export async function POST(request: NextRequest) {
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    try {
        const refreshTokenCookie = request.cookies.get("refreshToken")?.value;

        if (!refreshTokenCookie) {
            return NextResponse.json(
                { error: "Refresh token not found" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Verify JWT signature
        const decoded = verifyRefreshToken(refreshTokenCookie);
        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid or expired refresh token" },
                { status: 401 }
            );
        }

        // Check if token exists and is valid in database
        const storedToken = await RefreshToken.findOne({
            token: refreshTokenCookie,
            adminId: decoded.adminId,
        });

        if (!storedToken || !storedToken.isValid()) {
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                documentId: decoded.adminId,
                userId: decoded.adminId,
                userEmail: decoded.email,
                changes: {
                    ipAddress,
                    reason: storedToken ? "token_revoked_or_expired" : "token_not_found",
                    userName: decoded.email
                },
            });

            return NextResponse.json(
                { error: "Invalid or revoked refresh token" },
                { status: 401 }
            );
        }

        // Generate new tokens (token rotation)
        const newAccessToken = generateAccessToken({
            adminId: decoded.adminId,
            email: decoded.email,
            role: decoded.role,
        });

        const newRefreshToken = generateRefreshToken({
            adminId: decoded.adminId,
            email: decoded.email,
            role: decoded.role,
        });

        // Revoke old refresh token
        await RefreshToken.updateOne(
            { _id: storedToken._id },
            { $set: { isRevoked: true } }
        );

        // Store new refresh token
        const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await RefreshToken.create({
            token: newRefreshToken,
            adminId: decoded.adminId,
            expiresAt: refreshTokenExpiry,
            isRevoked: false,
            ipAddress,
            userAgent,
        });

        // Log token refresh
        await AuditLog.create({
            action: "LOGIN",
            targetCollection: "admin_auth",
            documentId: decoded.adminId,
            userId: decoded.adminId,
            userEmail: decoded.email,
            changes: { ipAddress, userAgent, userName: decoded.email },
        });

        // Send new tokens
        const response = NextResponse.json({
            success: true,
            accessToken: newAccessToken,
        });

        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Token refresh error:", error);

        await AuditLog.create({
            action: "LOGIN",
            targetCollection: "admin_auth",
            userId: null,
            userEmail: "system",
            changes: {
                ipAddress,
                error: error instanceof Error ? error.message : "Unknown error",
                identifier: "system"
            },
        });

        return NextResponse.json(
            { error: "An error occurred during token refresh" },
            { status: 500 }
        );
    }
}
