"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import type { Profile } from "@/lib/types/portfolio";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface FooterProps {
  profile: Profile | null;
}

export function Footer({ profile }: FooterProps) {
  const name = profile?.name?.split(" ")[0] || "Rohan";
  const socialLinks = profile?.socialLinks || [];
  const footerNav = profile?.footerNav || [];
  const phone = profile?.phone || "";
  const website = profile?.website || "";
  const email = profile?.email || "";

  return (
    <footer className="bg-secondary-dark text-gray-400 py-16 px-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer(0.1)}
      >
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          {/* Left Section - Logo and Description */}
          <motion.div 
            className="max-w-sm mb-10 md:mb-0"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Let&apos;s Connect there
            </h2>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                {name.charAt(0)}
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {name}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Passionate Full Stack Engineer dedicated to building high-quality,
              scalable web applications. Let&apos;s build something amazing together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  className="block"
                >
                    <motion.div
                        className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Icon name={social.icon} className="text-sm" />
                    </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right Section - Navigation, Contact, Newsletter */}
          <motion.div 
            className="flex flex-col md:flex-row gap-16"
            variants={fadeInUp}
          >
            {/* Navigation */}
            <div>
              <h4 className="text-primary font-bold mb-6">Navigation</h4>
              <ul className="space-y-3 text-sm">
                {footerNav.map((link) => (
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
                {phone && <li>{phone}</li>}
                {website && <li>{website}</li>}
                {email && <li>{email}</li>}
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
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary hover:bg-orange-600 text-white p-2 rounded-md transition-colors"
                >
                  <Icon name="send" className="text-sm" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Hire Me Button - Desktop Only */}
          <motion.div 
            className="hidden md:block"
            variants={fadeInUp}
          >
            <Link
              href="#contact"
              className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center"
            >
              Hire me <Icon name="north_east" className="ml-2 text-sm" />
            </Link>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
            className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs"
            variants={fadeInUp}
        >
          <p>
            Copyright © {new Date().getFullYear()} <span className="text-primary">{name}</span>. All
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
        </motion.div>
      </motion.div>
    </footer>
  );
}
