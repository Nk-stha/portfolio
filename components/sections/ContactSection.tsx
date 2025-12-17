"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../ui/Icon";
import { submitContact } from "@/lib/api/client";
import { fadeInUp, slideInLeft, scaleIn } from "@/lib/animations";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.message) {
      setStatus("error");
      setResponseMsg("Please fill in all fields");
      return;
    }

    setStatus("loading");
    
    try {
      const result = await submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: "contact_form",
      });
      
      setStatus("success");
      setResponseMsg(result.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setResponseMsg(error instanceof Error ? error.message : "Failed to submit");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      className="py-24 bg-[#0a0a0a] text-white rounded-3xl mx-2 md:mx-4 relative overflow-hidden"
      id="contact"
    >
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Text & Info */}
            <motion.div variants={slideInLeft}>
                <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
                    Contact
                </span>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
                    Let&apos;s Work <br />
                    <span className="text-primary">Together</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                    Have a project in mind? I&apos;m always excited to discuss new ideas and opportunities. 
                    Drop a message and let&apos;s create something amazing.
                </p>

                <div className="space-y-6">
                    <motion.div 
                        className="flex items-center space-x-4" 
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-primary">
                            <Icon name="mail_outline" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Me</p>
                            <a href="mailto:contact@rohanshrestha.com.np" className="text-white hover:text-primary transition-colors">contact@rohanshrestha.com.np</a>
                        </div>
                    </motion.div>
                     <motion.div 
                        className="flex items-center space-x-4"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-primary">
                            <Icon name="location_on" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                            <p className="text-white">Kathmandu, Nepal</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div 
                className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 md:p-8"
                variants={fadeInUp}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                            <motion.input
                                whileFocus={{ scale: 1.02, borderColor: "#ff6b35" }}
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                            <motion.input
                                whileFocus={{ scale: 1.02, borderColor: "#ff6b35" }}
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                         <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                        <motion.textarea
                            whileFocus={{ scale: 1.02, borderColor: "#ff6b35" }}
                            id="message"
                            name="message"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me about your project..."
                            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#ff8545" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-primary text-white font-semibold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/25 relative overflow-hidden"
                    >
                        {status === "loading" ? (
                             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                <Icon name="sync" className="mx-auto" />
                             </motion.div>
                        ) : "Send Message"}
                    </motion.button>

                    <AnimatePresence>
                        {responseMsg && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-4 rounded-lg text-sm text-center ${status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                            >
                                {responseMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
