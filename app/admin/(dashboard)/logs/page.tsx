
import { AuditLog } from "@/lib/db/models/auditLog.model";
import LogDetails from "./LogDetails";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs | Admin Dashboard",
  description: "View system audit logs",
};

export const dynamic = "force-dynamic";

async function getLogs() {
  await connectToDatabase();
  
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(100) // Limit to last 100 for now
    .lean();
    
  return JSON.parse(JSON.stringify(logs));
}

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">System Logs</h2>
        <p className="text-gray-400 mt-2">View recent system activity and audit trails.</p>
      </div>

      <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1a1a1a] bg-[#111]">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-300">Timestamp</th>
                <th className="px-6 py-4 font-medium text-gray-300">Action</th>
                <th className="px-6 py-4 font-medium text-gray-300">Collection</th>
                <th className="px-6 py-4 font-medium text-gray-300">User</th>
                <th className="px-6 py-4 font-medium text-gray-300">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-[#111]/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      log.action === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                      log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-500' :
                      log.action === 'DELETE' ? 'bg-red-500/10 text-red-500' :
                      (log.action === 'LOGIN' && (log.changes?.reason || log.changes?.error)) ? 'bg-red-500/10 text-red-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {log.action === 'LOGIN' && (log.changes?.reason || log.changes?.error) ? 'LOGIN FAILED' : log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                    {log.targetCollection}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex flex-col">
                      <span>{log.userEmail}</span>
                      <span className="text-xs text-gray-500">{log.ipAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <LogDetails data={log.changes} />
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
