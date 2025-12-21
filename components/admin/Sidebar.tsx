"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  Layers,
  MessageSquare,
  User,
  LogOut,
  Quote,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Projects", href: "/admin/projects", icon: FolderOpen },
    { name: "Experience", href: "/admin/experiences", icon: Briefcase },
    { name: "Process", href: "/admin/process", icon: Layers },
    { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      // If response is not ok, check if it's a 400 (no session)
      // If it's 400, we can proceed to redirect as we are effectively logged out
      // For other errors (500), we throw to prevent redirecting with an active session
      if (!response.ok && response.status !== 400) {
        throw new Error("Logout failed");
      }

      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between border-r border-[#1a1a1a] bg-[#0a0a0a] w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="px-4 py-6">
        <h1 className="mb-8 text-xl font-bold text-white px-2">
          Admin <span className="text-primary">Panel</span>
        </h1>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#1a1a1a]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
