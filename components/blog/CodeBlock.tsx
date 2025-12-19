"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export function CodeBlock({ className, children, inline, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCollapseToggle, setShowCollapseToggle] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Extract language from className (e.g., "language-typescript")
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const content = String(children).replace(/\n$/, "");
  const lineCount = content.split("\n").length;
  const isLong = lineCount > 15;

  useEffect(() => {
    if (isLong) {
      setIsCollapsed(true);
      setShowCollapseToggle(true);
    }
  }, [isLong]);

  // Clean up timeout on unmount
  useEffect(() => {
      return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
  }, []);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // @ts-ignore
        timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
          console.error('Failed to copy code', err);
      }
  };

  if (inline) {
    return (
      <code className={`${className} bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 text-sm font-medium`} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-6 group rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/10">
        <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {isCopied ? (
            <>
              <Icon name="check" size={14} className="text-accent-green" />
              <span className="text-accent-green">Copied!</span>
            </>
          ) : (
            <>
              <Icon name="content_copy" size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className={`relative ${isCollapsed ? "max-h-[300px] overflow-hidden" : ""}`}>
        <pre className="!bg-[#1e1e1e] !m-0 !p-4 overflow-x-auto">
          <code 
            ref={codeRef}
            className={`${className} ${lineCount > 10 ? 'grid grid-cols-[auto_1fr] gap-4' : 'block'}`} 
            {...props}
          >
             {content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                    {lineCount > 10 && (
                        <span className="text-gray-600 text-right select-none text-xs leading-6 min-w-[24px]">
                            {i + 1}
                        </span>
                    )}
                    <span className="leading-6">{line}</span>
                </React.Fragment>
             ))}
          </code>
        </pre>
        
        {/* Gradient Overlay when collapsed */}
        <AnimatePresence>
            {isCollapsed && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" 
            />
            )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      {showCollapseToggle && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full py-2 bg-[#252526] hover:bg-[#2d2d2d] text-xs text-gray-400 hover:text-white transition-colors border-t border-white/10 flex items-center justify-center space-x-2"
        >
          <span>{isCollapsed ? "Show more" : "Show less"}</span>
          <Icon name={isCollapsed ? "expand_more" : "expand_less"} size={16} />
        </button>
      )}
    </div>
  );
}
