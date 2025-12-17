"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { Profile } from "@/lib/types/portfolio";

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = profile?.navLinks || [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Process", href: "#services" },
    { label: "Resume", href: "#resume" },
    { label: "Project", href: "#projects" },
    { label: "Contact Us", href: "#contact" },
  ];

  const name = profile?.name?.split(" ")[0] || "Rohan";

  return (
    <motion.header 
      className="fixed top-6 left-0 right-0 z-50 px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <nav className="max-w-6xl mx-auto bg-black/90 backdrop-blur-md text-white rounded-full px-8 py-4 flex items-center justify-between border border-gray-800 shadow-2xl relative z-50">
        {/* Left Navigation - Desktop Only */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          {navLinks.slice(0, 3).map((link, index) => (
            <motion.li 
              key={link.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className={`${index === 0 ? "text-primary" : ""} hover:text-white transition-colors relative group`}
                href={link.href}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Center Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div 
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {name.charAt(0)}
          </motion.div>
          <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{name}</span>
        </Link>

        {/* Right Navigation - Desktop Only */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          {navLinks.slice(3).map((link) => (
            <motion.li 
              key={link.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="hover:text-white transition-colors relative group"
                href={link.href}
              >
                {link.label}
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Icon name={isMobileMenuOpen ? "close" : "menu"} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex items-center justify-center md:hidden"
          >
            <ul className="flex flex-col space-y-8 text-center">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-bold text-gray-300 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
