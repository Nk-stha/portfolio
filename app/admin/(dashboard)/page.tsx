export const dynamic = "force-dynamic";

import { AuditLog } from "@/lib/db/models/auditLog.model";
import { BlogPost, Project, ContactSubmission } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Activity 
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  await connectToDatabase();
  
  const [
    postsCount,
    projectsCount,
    messagesCount,
    recentActivity
  ] = await Promise.all([
    BlogPost.countDocuments({ deletedAt: null }),
    Project.countDocuments({ deletedAt: null }),
    ContactSubmission.countDocuments({}),
    AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    postsCount,
    projectsCount,
    messagesCount,
    recentActivity: JSON.parse(JSON.stringify(recentActivity)), // Serialize dates
  };
}

export default async function AdminDashboardPage() {
  const { postsCount, projectsCount, messagesCount, recentActivity } = await getStats();

  const stats = [
    { 
      name: "Total Posts", 
      value: postsCount, 
      icon: FileText, 
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/admin/blog"
    },
    { 
      name: "Total Projects", 
      value: projectsCount, 
      icon: FolderOpen, 
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      link: "/admin/projects"
    },
    { 
      name: "Messages", 
      value: messagesCount, 
      icon: MessageSquare, 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      link: "/admin/contact"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-gray-400 mt-2">Overview of your portfolio activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Link 
            key={item.name} 
            href={item.link}
            className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{item.name}</p>
                <p className="text-2xl font-semibold text-white group-hover:text-primary transition-colors">
                  {item.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          </div>
          <Link href="/admin/logs" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="px-6 py-4">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-[#1a1a1a]">
              {recentActivity.map((log: any) => (
                <li key={log._id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                        log.action === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                        log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                         {/* Simple dot or initial based on action */}
                         <span className="text-xs font-bold">{log.action[0]}</span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {log.action} <span className="text-gray-400">on</span> {log.targetCollection}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        ID: {log.documentId} • By: {log.userEmail}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
              {recentActivity.length === 0 && (
                <li className="py-8 text-center text-gray-500">
                    No activity recorded yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
