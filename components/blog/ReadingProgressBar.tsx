"use client";

import { useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(Math.round(latest * 100));
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent-blue origin-left z-50 shadow-[0_0_10px_var(--color-accent-blue)]"
      style={{ scaleX }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Reading progress"
    />
  );
}
