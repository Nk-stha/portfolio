"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export function ZoomImage({ src, alt }: { src?: string; alt?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!src) return null;

  return (
    <>
      <div 
        className="relative group cursor-zoom-in my-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
            }
        }}
        aria-label={alt ? `Zoom image: ${alt}` : "Zoom image"}
      >
        <img 
            src={src} 
            alt={alt || ""} 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
            loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Icon name="zoom_in" className="text-white drop-shadow-md" size={32} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label={alt || "Image zoom view"}
          >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-[95vw] max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={src} alt={alt || ""} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                {alt && (
                    <p className="text-center text-gray-400 mt-4 text-sm font-medium bg-black/50 backdrop-blur-md py-2 px-4 rounded-full inline-block left-1/2 -translate-x-1/2 relative">
                        {alt}
                    </p>
                )}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-colors"
                    aria-label="Close zoom view"
                >
                    <Icon name="close" size={24} />
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
