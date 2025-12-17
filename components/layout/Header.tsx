"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import type { Profile } from "@/lib/types/portfolio";

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
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
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <nav className="max-w-6xl mx-auto bg-black/90 backdrop-blur-md text-white rounded-full px-8 py-4 flex items-center justify-between border border-gray-800 shadow-2xl">
        {/* Left Navigation - Desktop Only */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          {navLinks.slice(0, 3).map((link, index) => (
            <li key={link.label}>
              <Link
                className={`${index === 0 ? "text-primary" : ""} hover:text-white transition-colors`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Center Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
          <span className="text-xl font-bold tracking-tight">{name}</span>
        </div>

        {/* Right Navigation - Desktop Only */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          {navLinks.slice(3).map((link) => (
            <li key={link.label}>
              <Link
                className="hover:text-white transition-colors"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <Icon name="menu" />
        </button>
      </nav>
    </header>
  );
}
