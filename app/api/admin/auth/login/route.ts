import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";

import { verifyPassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";
import { checkRateLimit, recordLoginAttempt } from "@/lib/auth/rate-limiter";
import { RefreshToken, AdminUser, AuditLog } from "@/lib/db/models";

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
        const { email, password } = await request.json();

        if (!email || !password) {
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                userId: null,
                userEmail: email || "unknown", // Capture email if provided
                changes: { ipAddress, reason: "missing_credentials" },
            });

            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check rate limiting
        const rateLimit = await checkRateLimit(email.toLowerCase(), ipAddress);
        if (!rateLimit.isAllowed) {
            const resetMinutes = rateLimit.resetTime
                ? Math.ceil((rateLimit.resetTime.getTime() - Date.now()) / 60000)
                : 15;

            // Log failed attempt due to rate limit
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                userId: null,
                userEmail: email,
                changes: { ipAddress, reason: "too_many_attempts", identifier: email },
            });

            return NextResponse.json(
                {
                    error: `Too many login attempts. Please try again in ${resetMinutes} minutes.`,
                    resetTime: rateLimit.resetTime,
                },
                { status: 429 }
            );
        }

        // Find admin user
        const admin = await AdminUser.findOne({
            email: email.toLowerCase(),
        });

        if (!admin) {
            // Record failed attempt
            await recordLoginAttempt(email.toLowerCase(), ipAddress, false);

            // Log failed login attempt
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                userId: null,
                userEmail: email,
                changes: { ipAddress, reason: "user_not_found", identifier: email },
            });

            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Check if account is locked
        if (admin.isLocked()) {
            const lockMinutes = admin.lockoutUntil
                ? Math.ceil((admin.lockoutUntil.getTime() - Date.now()) / 60000)
                : 30;

            // Log locked account attempt
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                documentId: admin._id.toString(),
                userId: admin._id,
                userEmail: admin.email,
                changes: { ipAddress, reason: "account_locked", lockMinutes, userName: admin.name },
            });

            return NextResponse.json(
                {
                    error: `Account locked due to too many failed attempts. Please try again in ${lockMinutes} minutes.`,
                    lockoutUntil: admin.lockoutUntil,
                },
                { status: 423 }
            );
        }

        // Check if account is active
        if (!admin.isActive) {
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                documentId: admin._id.toString(),
                userId: admin._id,
                userEmail: admin.email,
                changes: { ipAddress, reason: "account_inactive", userName: admin.name },
            });

            return NextResponse.json(
                { error: "Account is inactive" },
                { status: 403 }
            );
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, admin.passwordHash);

        if (!isPasswordValid) {
            // Increment login attempts
            await admin.incLoginAttempts();
            await recordLoginAttempt(email.toLowerCase(), ipAddress, false);

            // Log failed login
            await AuditLog.create({
                action: "LOGIN",
                targetCollection: "admin_auth",
                documentId: admin._id.toString(),
                userId: admin._id,
                userEmail: admin.email,
                changes: {
                    ipAddress,
                    reason: "invalid_password",
                    attempts: admin.loginAttempts + 1,
                    userName: admin.name
                },
            });

            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Successful login - reset attempts
        await admin.resetLoginAttempts();
        await recordLoginAttempt(email.toLowerCase(), ipAddress, true);

        // Generate tokens
        const tokenPayload = {
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Store refresh token in database
        const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await RefreshToken.create({
            token: refreshToken,
            adminId: admin._id,
            expiresAt: refreshTokenExpiry,
            isRevoked: false,
            ipAddress,
            userAgent,
        });

        // Log successful login
        await AuditLog.create({
            action: "LOGIN",
            targetCollection: "admin_auth",
            documentId: admin._id.toString(),
            userId: admin._id,
            userEmail: admin.email,
            changes: { ipAddress, userAgent, userName: admin.name },
        });

        // Set refresh token as httpOnly cookie
        const response = NextResponse.json({
            success: true,
            accessToken,
            user: {
                id: admin._id.toString(),
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);

        // Log system error
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
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}
