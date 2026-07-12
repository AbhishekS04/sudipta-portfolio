"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { bind, play } from "cuelume";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AboutClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize interactive sounds and Indian Standard Time (IST) clock
  useEffect(() => {
    bind();
    setTimeout(() => setIsMounted(true), 0);

    const updateTime = () => {
      const now = new Date();
      // India is UTC +5.5 hours
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 3600000 * 5.5);

      const hours = String(ist.getHours()).padStart(2, "0");
      const minutes = String(ist.getMinutes()).padStart(2, "0");
      const seconds = String(ist.getSeconds()).padStart(2, "0");

      setTimeStr(`${hours}:${minutes}:${seconds} (IST)`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP animation for slide-out Contact Form panel
  useEffect(() => {
    if (!isMounted) return;

    if (isContactOpen) {
      document.body.style.overflow = "hidden";

      // Fade in backdrop
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      // Slide in contact form
      gsap.to(overlayRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      document.body.style.overflow = "";

      // Slide out contact form
      gsap.to(overlayRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });

      // Fade out backdrop
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isContactOpen, isMounted]);

  // Fade-in animation for About page content on mount
  useGSAP(() => {
    if (!isMounted || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
    );
  }, [isMounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
      try {
        play("success");
      } catch (err) {
        console.warn(err);
      }
    }, 600);
  };

  const closeContactForm = () => {
    setIsContactOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg font-sans selection:bg-brand-accent selection:text-brand-dark">
      {/* Navigation Header */}
      <Header />

      {/* Main Container */}
      <main
        ref={contentRef}
        className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-between py-8 md:py-16 opacity-0"
      >
        {/* Large Editorial Serif Headline (Typography Only) */}
        <div className="w-full px-6 md:px-12 lg:px-16 mb-16 md:mb-24">
          <h1 className="font-serif text-[7.5vw] sm:text-[6.5vw] md:text-[5vw] lg:text-[4.2vw] font-normal leading-[1.08] tracking-tight text-brand-dark">
            Sudipta Sarkar is an <span className="italic font-normal">artist</span> exploring the
            interplay between <span className="italic font-normal">botanical beauty</span>,{" "}
            <span className="italic font-normal">warm colors</span> and{" "}
            <span className="italic font-normal">lineart</span>.
          </h1>
        </div>

        {/* 4-Column Responsive Grid Layout */}
        <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 border-t border-black/[0.08] pt-12">
          {/* Column 1: Typographic Blue Contact Card */}
          <div
            onClick={() => setIsContactOpen(true)}
            className="group relative flex flex-col justify-between bg-[#0B74C9] p-7 md:p-8 rounded-[2.2rem] h-[360px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-sm overflow-hidden select-none"
            data-cuelume-press="tick"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-bg/60">
                Inquiry
              </span>
              <h3 className="font-serif text-[1.6rem] sm:text-[1.8rem] italic font-normal text-brand-bg leading-tight mt-4">
                Let&apos;s build something beautiful together.
              </h3>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <p className="font-sans text-xs text-brand-bg uppercase tracking-wider font-bold flex items-center gap-1.5">
                Get in touch
                <span className="inline-block transform group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </p>
              <div className="text-[9px] uppercase font-bold text-brand-bg/50 tracking-widest border-t border-brand-bg/10 pt-3">
                Available for freelance & commissions
              </div>
            </div>
          </div>

          {/* Column 2: Selected Clients */}
          <div className="flex flex-col items-start">
            <span className="inline-block bg-black/[0.04] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted/90 mb-5 select-none">
              Selected clients
            </span>
            <p className="font-sans text-[15px] font-bold text-brand-dark leading-relaxed">
              Google • Penguin Random House • Starbucks • Airbnb • The New York Times
            </p>
          </div>

          {/* Column 3: Say Hi! */}
          <div className="flex flex-col items-start">
            <span className="inline-block bg-black/[0.04] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted/90 mb-5 select-none">
              Say Hi!
            </span>
            <div className="flex flex-col gap-2 font-sans text-[15px] font-bold text-brand-dark">
              <a
                href="mailto:sudiptasarkar@email.com"
                className="hover:text-brand-muted transition-colors"
                data-cuelume-press="tick"
              >
                sudiptasarkar@email.com
              </a>
              <span className="text-brand-muted/80">+91 (0) 987 65 43 210</span>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-muted transition-colors"
                  data-cuelume-press="tick"
                >
                  Instagram
                </a>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-muted transition-colors"
                  data-cuelume-press="tick"
                >
                  Behance
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Dynamic Clock */}
          <div className="flex flex-col items-start w-full">
            <span className="inline-block bg-black/[0.04] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted/90 mb-5 select-none">
              Location
            </span>
            <div className="font-sans text-[15px] font-bold text-brand-dark">
              <p>Based in Kolkata, India</p>
              <p className="text-xs font-semibold text-brand-muted mt-1 select-none">
                {timeStr ? timeStr : "00:00:00 (IST)"} • Sunny 28°
              </p>
            </div>

            {/* Typographic representation of time zone */}
            <div className="mt-12 font-serif text-[2.8rem] leading-none italic text-brand-dark/25 select-none tracking-tight">
              GMT+5:30
            </div>
          </div>
        </div>

        {/* Dynamic Footer Credits */}
        <div className="mt-20 border-t border-black/[0.05] pt-6 pb-2 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-wider text-brand-muted/70 px-6 md:px-12 lg:px-16">
          <div className="select-none">Site Credits</div>
          <div className="flex gap-6 mt-3 sm:mt-0">
            <a href="#" className="hover:text-brand-dark transition-colors">
              Imprint
            </a>
            <a href="#" className="hover:text-brand-dark transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </main>

      {/* Slide-out Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeContactForm}
        className="fixed inset-0 bg-black/35 backdrop-blur-xs z-[99998] pointer-events-none opacity-0"
        style={{
          display: isContactOpen ? "block" : "none",
          pointerEvents: isContactOpen ? "auto" : "none",
        }}
      />

      {/* Slide-out Contact Panel */}
      <div
        ref={overlayRef}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-brand-bg shadow-2xl z-[99999] flex flex-col p-8 md:p-10 border-l border-black/[0.05]"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Panel Close Button */}
        <button
          onClick={closeContactForm}
          className="absolute top-6 right-6 p-2 rounded-full border border-black/[0.1] bg-brand-bg text-brand-dark hover:bg-brand-dark hover:text-brand-bg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Panel Form Content */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-12">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted select-none">
            Inquiry
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-brand-dark">
            Start a Project
          </h2>
          <p className="mt-2 text-xs text-brand-muted leading-relaxed select-none">
            Have an idea, commission, or freelance project? Drop a message below and I&apos;ll get
            back to you.
          </p>

          <div className="mt-8 w-full">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted/80 mb-1 select-none">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-brand-bg px-4 py-3 text-sm text-brand-dark placeholder-brand-muted/40 focus:border-brand-dark focus:outline-none transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted/80 mb-1 select-none">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-brand-bg px-4 py-3 text-sm text-brand-dark placeholder-brand-muted/40 focus:border-brand-dark focus:outline-none transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted/80 mb-1 select-none">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-brand-bg px-4 py-3 text-sm text-brand-dark placeholder-brand-muted/40 focus:border-brand-dark focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-brand-dark py-3.5 text-sm font-semibold uppercase tracking-wider text-brand-bg hover:bg-brand-dark/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  data-cuelume-press="tick"
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center p-6 bg-brand-accent/20 rounded-2xl border border-black/[0.02] select-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-brand-bg mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-brand-dark text-lg">
                  Thank you, {formData.name}!
                </h3>
                <p className="mt-2 text-xs text-brand-muted max-w-xs leading-relaxed">
                  Your message has been sent successfully. Sudipta will get back to you at{" "}
                  <span className="font-medium text-brand-dark">{formData.email}</span> within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", message: "" });
                  }}
                  className="mt-6 text-[10px] font-bold uppercase tracking-wider text-brand-dark hover:underline"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
