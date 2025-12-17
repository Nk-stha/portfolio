"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { submitContact } from "@/lib/api/client";

export function ContactSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");
    
    try {
      const result = await submitContact({
        email,
        source: "contact_form",
      });
      
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to submit");
    }
  };

  return (
    <section
      className="pt-32 pb-24 bg-background-light dark:bg-background-dark"
      id="contact"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
          Have An Awesome Project Idea?{" "}
          <span className="text-primary">Let&apos;s Discuss</span>
        </h2>

        {/* Email Input with CTA */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-surface-dark rounded-full shadow-lg p-2 pl-6 flex flex-col md:flex-row items-center border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="p-2 text-primary">
              <Icon name="mail_outline" />
            </div>
            <input
              className="flex-grow bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 w-full md:w-auto text-sm py-3 px-2 outline-none"
              placeholder="Enter Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
            <button 
              type="submit"
              disabled={status === "loading"}
              className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors w-full md:w-auto mt-2 md:mt-0 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Book Call"}
            </button>
          </div>
        </form>

        {/* Status Message */}
        {message && (
          <p className={`mt-4 text-sm ${status === "success" ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* Features List */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Icon name="check" className="text-primary text-sm mr-1" />
            4.9/5 Average Ratings
          </div>
          <div className="flex items-center">
            <Icon name="check" className="text-primary text-sm mr-1" />
            25+ Winning Awards
          </div>
          <div className="flex items-center">
            <Icon name="check" className="text-primary text-sm mr-1" />
            Certified Cloud Architect
          </div>
        </div>
      </div>
    </section>
  );
}
