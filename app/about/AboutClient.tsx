"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { bind, play } from "cuelume";
import { useRouter } from "next/navigation";

export default function AboutClient() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize interactive UI sounds and mount state on the About page
  useEffect(() => {
    bind();
    setIsMounted(true);
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push(href);
    }, 450); // Matches the CSS transition delay slightly below 500ms
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      setIsSubmitted(true);
      play("success"); // Play interactive success sound upon submission
    }, 600);
  };

  return (
    <div 
      className={`flex min-h-screen flex-col bg-brand-bg font-sans selection:bg-brand-accent selection:text-brand-dark transition-all duration-500 ease-in-out ${
        isMounted && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {/* Navigation Header */}
      <Header onNavigate={handleNavigate} />

      {/* Standalone About Me Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:px-12 lg:px-16 md:py-20">
        <div className="flex flex-col gap-16 md:flex-row md:items-start">
          
          {/* Left Column: Typography Biography */}
          <div className="flex-1 max-w-xl">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              About Me
            </span>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-brand-dark md:text-5xl">
              Sudipta Sarkar
            </h1>
            <p className="mt-8 font-sans text-base leading-relaxed text-brand-muted">
              Hi, I&apos;m Sudipta! I am an artist who loves to draw and sketch. I have a deep passion for coffee, warm colors, and beautiful lineart. My work is inspired by quiet moments, botanical beauty, and visual storytelling.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-muted">
              I collaborate with editorial publications, brands, and creative authors to turn concepts into evocative drawings and sketches for book covers, packaging, and digital spaces.
            </p>
            
            <div className="mt-10">
              <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-muted/70">
                Select Clients
              </span>
              <p className="mt-2 font-sans text-sm font-semibold text-brand-dark leading-relaxed">
                Google / Penguin Random House / Starbucks / Airbnb / The New York Times
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-black/[0.05]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-3">
                Socials
              </span>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-brand-dark">
                <a href="mailto:sudiptasarkar@email.com" className="hover:text-brand-muted transition-colors" data-cuelume-press="tick">
                  sudiptasarkar@email.com
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-muted transition-colors" data-cuelume-press="tick">
                  Instagram
                </a>
                <a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-brand-muted transition-colors" data-cuelume-press="tick">
                  Behance
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Contact Form */}
          <div className="w-full md:w-[420px] bg-brand-card p-8 md:p-10 rounded-3xl border border-black/[0.03] shadow-sm flex-shrink-0">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              Contact
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-dark">
              Start a Conversation
            </h2>
            <p className="mt-1 text-xs text-brand-muted leading-relaxed">
              Have an idea, commission, or freelance project? Drop a message below.
            </p>

            <div className="mt-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-black/[0.08] bg-brand-bg px-4 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-dark focus:outline-none transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-black/[0.08] bg-brand-bg px-4 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-dark focus:outline-none transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-black/[0.08] bg-brand-bg px-4 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-dark focus:outline-none transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-brand-dark py-3.5 text-sm font-semibold uppercase tracking-wider text-brand-bg hover:bg-brand-dark/90 transition-colors cursor-pointer"
                    data-cuelume-press="tick"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center p-6 bg-brand-accent/30 rounded-2xl animate-fade-in border border-black/[0.02]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-brand-bg mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-brand-dark text-lg">Thank you, {formData.name}!</h3>
                  <p className="mt-2 text-xs text-brand-muted max-w-xs leading-relaxed">
                    Your message has been sent successfully. Sudipta will get back to you at <span className="font-medium text-brand-dark">{formData.email}</span> within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Copyright Footer */}
      <footer className="w-full bg-transparent py-12 px-6 md:px-12 lg:px-16 text-center">
        <p className="text-xs font-medium text-brand-muted">
          © 2026 Sudipta Sarkar. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
