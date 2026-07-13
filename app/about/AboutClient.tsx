"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { bind } from "cuelume";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AboutClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeStr, setTimeStr] = useState("");

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

  // GSAP animation for Awwwards-level entrance stagger
  useGSAP(() => {
    if (!isMounted || !contentRef.current) return;

    const tl = gsap.timeline();
    tl.to(contentRef.current, { opacity: 1, duration: 0.3 });
    tl.fromTo(
      ".animate-fade-up",
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.35, ease: "power4.out", stagger: 0.15 },
      "-=0.1",
    );
  }, [isMounted]);

  return (
    <div className="flex min-h-screen md:h-screen flex-col bg-brand-bg font-sans selection:bg-brand-accent selection:text-brand-dark md:overflow-hidden relative">
      {/* Subtle Noise/Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018] z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation Header */}
      <Header />

      {/* Main Container */}
      <main
        ref={contentRef}
        className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-between py-8 md:py-8 opacity-0 relative z-10"
      >
        {/* Centered Editorial Copy Block */}
        <div className="w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col items-center justify-center relative">
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-6 md:gap-8">
            {/* <span className="animate-fade-up opacity-0 font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted/70 select-none bg-black/[0.03] px-3.5 py-1 rounded-full w-fit mx-auto">
              About Sudipta
            </span> */}

            <h1 className="animate-fade-up opacity-0 font-serif text-[8.5vw] sm:text-[6.5vw] md:text-[4.5vw] lg:text-[3.5vw] font-normal leading-[1.12] tracking-tight text-brand-dark max-w-4xl mx-auto">
              Sudipta Sarkar is an <span className="italic text-brand-muted">artist</span> and{" "}
              <span className="italic text-brand-muted">illustrator</span> exploring the quiet
              interplay between <span className="italic">botanical beauty</span>, warm color
              palettes, and minimalist <span className="italic">lineart</span>.
            </h1>

            {/* <p className="animate-fade-up opacity-0 font-sans text-sm sm:text-base md:text-md font-normal leading-relaxed text-brand-muted/80 max-w-2xl mx-auto">
              Collaborating with brands, publishers, and independent clients globally, she captures the delicate patterns of the natural world, turning organic forms into calm, modern editorial designs.
            </p> */}
          </div>
        </div>

        {/* 2-Column Responsive Grid Layout (Location on Left, Say Hi on Right) */}
        <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 pt-12 pb-12 relative">
          {/* Column 1: Location & Dynamic Clock */}
          <div className="animate-fade-up opacity-0 flex flex-col justify-between w-full h-full min-h-[180px]">
            <div>
              <span className="w-fit bg-black/[0.04] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted/90 mb-5 select-none flex">
                Location
              </span>
              <div className="font-sans text-[15px] font-bold text-brand-dark tracking-tight">
                <p>Based in Kolkata, India</p>
                <p className="text-xs font-mono font-medium text-brand-muted mt-1.5 select-none">
                  {timeStr ? timeStr : "00:00:00 (IST)"} • Sunny 28°
                </p>
              </div>
            </div>
            {/* <div className="mt-12 font-serif text-[2.8rem] leading-none italic text-brand-dark/25 select-none tracking-tight">
              GMT+5:30
            </div> */}
          </div>

          {/* Column 2: Say Hi! */}
          <div className="animate-fade-up opacity-0 flex flex-col items-start md:items-end w-full h-full min-h-[180px]">
            <span className="w-fit bg-black/[0.04] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted/90 mb-5 select-none flex">
              Say Hi!
            </span>
            <div className="flex flex-col items-start md:items-end gap-2 font-sans text-[15px] font-bold text-brand-dark w-full">
              <a
                href="mailto:sudiptasarkar@email.com"
                className="hover:text-brand-muted transition-colors w-fit text-left md:text-right"
                data-cuelume-press="tick"
              >
                sudiptasarkar@email.com
              </a>
              <div className="flex gap-8 mt-2 select-none w-fit md:justify-end">
                <a
                  href="https://www.instagram.com/bristtiiii/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-muted transition-colors"
                  data-cuelume-press="tick"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* GIF fixed to the viewport bottom, independent of document flow */}
        <div className="animate-fade-up opacity-0 fixed bottom-[-10] right-[-32%] md:right-[5%] z-10 pointer-events-none flex items-end gap-2 select-none">
          <div className="w-[380px] md:w-[400px] h-[320px] md:h-[320px] overflow-hidden flex items-start justify-center translate-y-[35%]">
            <img
              src="/gif/person-pointing-at-something.gif"
              alt="Pointing to Instagram"
              className="object-contain w-full h-full scale-x-[-1]"
            />
          </div>
          {/* <a
            href="https://www.instagram.com/bristtiiii/"
            target="_blank"
            rel="noreferrer"
            className={`pointer-events-auto text-4xl md:text-5xl text-brand-dark hover:text-brand-muted transition-colors cursor-pointer leading-none mb-4 lowercase ${sacramento.className}`}
            data-cuelume-press="tick"
          >
            contact
          </a> */}
        </div>
      </main>
    </div>
  );
}
