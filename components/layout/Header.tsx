"use client";

import React from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants/portfolio-data";
import { Icon } from "../ui/Icon";

export function Header() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <nav className="max-w-6xl mx-auto bg-black/90 backdrop-blur-md text-white rounded-full px-8 py-4 flex items-center justify-between border border-gray-800 shadow-2xl">
        {/* Left Navigation - Desktop Only */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <li>
            <Link
              className="text-primary hover:text-primary transition-colors"
              href={NAV_LINKS[0].href}
            >
              {NAV_LINKS[0].label}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-white transition-colors"
              href={NAV_LINKS[1].href}
            >
              {NAV_LINKS[1].label}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-white transition-colors"
              href={NAV_LINKS[2].href}
            >
              {NAV_LINKS[2].label}
            </Link>
          </li>
        </ul>

        {/* Center Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            R
          </div>
          <span className="text-xl font-bold tracking-tight">Rohan</span>
        </div>

        {/* Right Navigation - Desktop Only */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <li>
            <Link
              className="hover:text-white transition-colors"
              href={NAV_LINKS[3].href}
            >
              {NAV_LINKS[3].label}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-white transition-colors"
              href={NAV_LINKS[4].href}
            >
              {NAV_LINKS[4].label}
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-white transition-colors"
              href={NAV_LINKS[5].href}
            >
              {NAV_LINKS[5].label}
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <Icon name="menu" />
        </button>
      </nav>
    </header>
  );
}
