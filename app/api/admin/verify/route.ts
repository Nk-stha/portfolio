import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const { key } = await request.json();
        const validKey = process.env.ADMIN_ACCESS_KEY || "secret";

        if (key === validKey) {
            const cookieStore = await cookies();
            cookieStore.set("admin_key", validKey, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid key" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
