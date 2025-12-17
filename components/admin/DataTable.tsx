"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Edit, 
  Trash 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  newLabel?: string;
  newHref?: string;
  onDelete?: (row: T) => Promise<void>;
  editHref?: (row: T) => string;
}

export function DataTable<T extends { _id: string }>({
  data,
  columns,
  searchKey,
  newLabel,
  newHref,
  onDelete,
  editHref,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter
  const filteredData = data.filter((item) => {
    if (!searchKey) return true;
    const value = item[searchKey];
    if (typeof value === "string") {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (row: T) => {
    if (!onDelete || !confirm("Are you sure you want to delete this item?")) return;
    
    try {
      setIsDeleting(row._id);
      await onDelete(row);
      router.refresh();
    } catch (error) {
      alert("Failed to delete item");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
        
        {newLabel && newHref && (
          <Link
            href={newHref}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            {newLabel}
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111] text-gray-400">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className={`px-6 py-4 font-medium ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
                {(editHref || onDelete) && (
                  <th className="px-6 py-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {paginatedData.map((row) => (
                <tr key={row._id} className="hover:bg-[#111]/50 transition-colors">
                  {columns.map((col, i) => (
                    <td key={i} className={`px-6 py-4 ${col.className || ''}`}>
                      {typeof col.accessorKey === 'function' ? (
                        col.accessorKey(row)
                      ) : (
                        (row[col.accessorKey] as React.ReactNode)
                      )}
                    </td>
                  ))}
                  {(editHref || onDelete) && (
                    <td className="px-6 py-4 text-right space-x-2">
                       {editHref && (
                        <Link
                          href={editHref(row)}
                          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-[#222] text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                       )}
                       {onDelete && (
                        <button
                          disabled={isDeleting === row._id}
                          onClick={() => handleDelete(row)}
                          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                       )}
                    </td>
                  )}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
           <button
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="p-2 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] text-gray-400 disabled:opacity-50 hover:text-white transition-colors"
           >
             <ChevronLeft className="h-4 w-4" />
           </button>
           <div className="flex items-center px-4 text-sm text-gray-400">
             Page {page} of {totalPages}
           </div>
           <button
             disabled={page === totalPages}
             onClick={() => setPage(p => p + 1)}
             className="p-2 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] text-gray-400 disabled:opacity-50 hover:text-white transition-colors"
           >
             <ChevronRight className="h-4 w-4" />
           </button>
        </div>
      )}
    </div>
  );
}
