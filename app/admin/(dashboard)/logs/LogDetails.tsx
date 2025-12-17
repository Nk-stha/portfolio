
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LogDetailsProps {
    data: Record<string, unknown>;
}

export default function LogDetails({ data }: LogDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!data || Object.keys(data).length === 0) {
        return <span className="text-gray-600">-</span>;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                title="View Details"
            >
                View Details
                {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-6 z-50 w-72 rounded-lg border border-[#333] bg-[#111] p-4 shadow-xl">
                        <pre className="max-h-60 overflow-auto rounded bg-black/50 p-2 text-xs text-gray-300 scrollbar-thin scrollbar-thumb-gray-700">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </>
            )}
        </div>
    );
}
