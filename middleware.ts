import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- Route Classifications ---
    const isAdminApi = pathname.startsWith('/api/admin');
    const isAuthApi = pathname.startsWith('/api/admin/auth');

    // Frontend Admin Routes (exclude login)
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname.startsWith('/admin/login');

    // Public API Write Protection
    const isPublicApiWrite = pathname.startsWith('/api/') && !isAdminApi && !pathname.startsWith('/api/contact') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);

    // --- 1. Skip Open Routes ---
    if (isAuthApi || isLoginPage) {
        return NextResponse.next();
    }

    // --- 2. Protect Admin Frontend Pages ---
    // Checks for Refresh Token cookie because frontend navigation relies on cookies
    if (isAdminPage) {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if (!refreshSecret) {
                console.error('CRITICAL: JWT_REFRESH_SECRET is not defined in environment variables');
                return NextResponse.json(
                    { error: 'Internal Server Error - Security configuration missing' },
                    { status: 500 }
                );
            }
            const secret = new TextEncoder().encode(refreshSecret);
            await jwtVerify(refreshToken, secret);
            return NextResponse.next();
        } catch (error) {
            // Token is invalid or expired
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // --- 3. Protect API Routes ---
    // Checks for Bearer Token (preferred) logic
    // --- 3. Protect API Routes ---
    // Checks for Bearer Token (preferred) OR Cookie (fallback for internal tools)
    if (isAdminApi || isPublicApiWrite) {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        // Scenario A: Bearer Token provided (standard API usage)
        if (token) {
            try {
                const accessSecret = process.env.JWT_ACCESS_SECRET;
                if (!accessSecret) {
                    console.error('CRITICAL: JWT_ACCESS_SECRET is not defined in environment variables');
                    return NextResponse.json(
                        { error: 'Internal Server Error - Security configuration missing' },
                        { status: 500 }
                    );
                }
                const secret = new TextEncoder().encode(accessSecret);
                await jwtVerify(token, secret);
                return NextResponse.next();
            } catch (error) {
                return NextResponse.json(
                    { error: 'Unauthorized - Invalid or expired token' },
                    { status: 401 }
                );
            }
        }

        // Scenario B: No Bearer Token, check for Cookie (Browser/Admin Panel usage)
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (refreshToken) {
            try {
                const refreshSecret = process.env.JWT_REFRESH_SECRET;
                if (!refreshSecret) {
                    console.error('CRITICAL: JWT_REFRESH_SECRET is not defined in environment variables');
                    return NextResponse.json(
                        { error: 'Internal Server Error - Security configuration missing' },
                        { status: 500 }
                    );
                }
                const secret = new TextEncoder().encode(refreshSecret);
                await jwtVerify(refreshToken, secret);
                return NextResponse.next();
            } catch (error) {
                return NextResponse.json(
                    { error: 'Unauthorized - Invalid or expired cookie session' },
                    { status: 401 }
                );
            }
        }

        // Scenario C: Neither provided
        return NextResponse.json(
            { error: 'Unauthorized - No authentication provided' },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const config = {
    // Match API routes AND Admin frontend routes
    matcher: ['/api/:path*', '/admin/:path*'],
};
