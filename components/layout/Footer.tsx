import React from "react";
import Link from "next/link";
import { FOOTER_NAV, SOCIAL_LINKS } from "@/lib/constants/portfolio-data";
import { Icon } from "../ui/Icon";

export function Footer() {
  return (
    <footer className="bg-secondary-dark text-gray-400 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          {/* Left Section - Logo and Description */}
          <div className="max-w-sm mb-10 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-4">
              Let&apos;s Connect there
            </h2>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                J
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Jenny
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Passionate Full Stack Engineer dedicated to building high-quality,
              scalable web applications. Let&apos;s build something amazing together.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon name={social.icon} className="text-sm" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Navigation, Contact, Newsletter */}
          <div className="flex flex-col md:flex-row gap-16">
            {/* Navigation */}
            <div>
              <h4 className="text-primary font-bold mb-6">Navigation</h4>
              <ul className="space-y-3 text-sm">
                {FOOTER_NAV.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-primary font-bold mb-6">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>+012-3456-789</li>
                <li>www.jennydev.com</li>
                <li>hello@jennydev.com</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="max-w-xs">
              <h4 className="text-primary font-bold mb-6">
                Get the latest information
              </h4>
              <div className="flex bg-white rounded-lg overflow-hidden p-1">
                <input
                  className="bg-transparent border-none focus:ring-0 text-gray-800 text-xs px-3 w-full"
                  placeholder="Email address"
                  type="email"
                />
                <button className="bg-primary hover:bg-orange-600 text-white p-2 rounded-md transition-colors">
                  <Icon name="send" className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Hire Me Button - Desktop Only */}
          <div className="hidden md:block">
            <Link
              href="#contact"
              className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center"
            >
              Hire me <Icon name="north_east" className="ml-2 text-sm" />
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>
            Copyright © 2023 <span className="text-primary">Jenny</span>. All
            Rights Reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              User Terms &amp; Conditions
            </Link>
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
