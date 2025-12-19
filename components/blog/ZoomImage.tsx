"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export function ZoomImage({ src, alt }: { src?: string; alt?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <div 
        className="relative group cursor-zoom-in my-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(true);
            }
        }}
        aria-label={`Zoom image: ${alt}`}
      >
        {/* We use a regular img for the inline display to work easily with prose, 
            or Next/Image if we know dimensions. 
            ReactMarkdown passes src url. using next/image requires width/height.
            So we'll use regular img with optimizations if possible, or fill wrapper.
        */}
        <img 
            src={src} 
            alt={alt} 
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
          >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-[90vw] max-h-[90vh]"
            >
                <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                <p className="text-center text-gray-400 mt-4 text-sm font-medium">{alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
