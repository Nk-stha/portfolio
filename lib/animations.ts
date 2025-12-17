
import { Variants, Transition, Easing } from "framer-motion";

// =============================================================================
// SENIOR UX MOTION DESIGNER - ANIMATION SYSTEM
// =============================================================================
// Philosophy: "Motion should guide, not distract."
// Performance: All animations use GPU-accelerated properties (transform, opacity).

// -----------------------------------------------------------------------------
// Timing & Easing (Standardized)
// -----------------------------------------------------------------------------
export const EASE_STANDARD: Easing = [0.4, 0.0, 0.2, 1]; // Material Design standard ease
export const EASE_BOUNCE: Easing = [0.34, 1.56, 0.64, 1]; // Gentle bounce for personality

export const DURATION = {
    FAST: 0.2,   // Micro-interactions (hover, click)
    MEDIUM: 0.4, // Small content reveals
    SLOW: 0.6,   // Large section reveals
    HERO: 0.8,   // First impression elements
};

// -----------------------------------------------------------------------------
// Reusable Variants
// -----------------------------------------------------------------------------

// 1. Fade Up (Best for text/content sections)
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        transition: { duration: 0.01 } // Instant reset
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: DURATION.SLOW,
            ease: EASE_STANDARD
        }
    }
};

// 2. Fade In (Best for images/backgrounds)
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: DURATION.SLOW,
            ease: EASE_STANDARD
        }
    }
};

// 3. Stagger Container (Parent for lists/grids)
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

// 4. Scale In (For focus elements like logos/badges)
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: DURATION.MEDIUM,
            ease: EASE_BOUNCE
        }
    }
};

// 5. Slide In Left/Right (For timeline/process steps)
export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: DURATION.SLOW, ease: EASE_STANDARD }
    }
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: DURATION.SLOW, ease: EASE_STANDARD }
    }
};

// -----------------------------------------------------------------------------
// Micro-Interactions (Hover/Tap)
// -----------------------------------------------------------------------------
export const hoverScale: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: DURATION.FAST, ease: "easeOut" }
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
    }
};

export const hoverGlow = (color: string = "rgba(255,107,53,0.6)"): Variants => ({
    hover: {
        boxShadow: `0 0 20px ${color}`,
        scale: 1.05,
        transition: { duration: DURATION.FAST }
    }
});
