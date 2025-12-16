import React from "react";

export function ScrollingBanner() {
  return (
    <div className="bg-primary text-white py-4 overflow-hidden -rotate-1 transform origin-center scale-105 shadow-xl relative z-20">
      <div className="scrolling-text-container">
        <div className="scrolling-text text-xl md:text-2xl font-bold uppercase tracking-widest flex items-center">
          System Architecture <span className="mx-4 text-3xl">+</span>
          API Development <span className="mx-4 text-3xl">+</span>
          React / Next.js <span className="mx-4 text-3xl">+</span>
          Cloud Infrastructure <span className="mx-4 text-3xl">+</span>
          System Architecture <span className="mx-4 text-3xl">+</span>
          API Development <span className="mx-4 text-3xl">+</span>
          React / Next.js <span className="mx-4 text-3xl">+</span>
          Cloud Infrastructure <span className="mx-4 text-3xl">+</span>
        </div>
      </div>
    </div>
  );
}
