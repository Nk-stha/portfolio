import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import React from "react";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/db/mongoose";
import { RefreshToken } from "@/lib/db/models";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get("refreshToken");

  // Check if refresh token exists and is valid
  if (!refreshTokenCookie?.value) {
    redirect("/admin/login");
  }

  try {
    // Verify JWT signature
    const decoded = verifyRefreshToken(refreshTokenCookie.value);
    
    if (!decoded) {
      redirect("/admin/login");
    }

    // Verify token exists in database and is not revoked
    await connectToDatabase();
    
    const storedToken = await RefreshToken.findOne({
      token: refreshTokenCookie.value,
      adminId: decoded.adminId,
    });

    if (!storedToken || !storedToken.isValid()) {
      redirect("/admin/login");
    }

    // Token is valid, allow access
  } catch (error) {
    console.error("Auth verification error:", error);
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
