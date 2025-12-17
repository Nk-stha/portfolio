import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminKey = cookieStore.get("admin_key");
  const accessKey = process.env.ADMIN_ACCESS_KEY || "secret";

  // if (!adminKey || adminKey.value !== accessKey) {
  //   redirect("/admin/login");
  // }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
