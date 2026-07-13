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
  const introLineRef = useRef<HTMLDivElement>(null);
  const footerRowRef = useRef<HTMLDivElement>(null);
  const gifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bind();
    setTimeout(() => setIsMounted(true), 0);

    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 3600000 * 5.5);
      const hours = String(ist.getHours()).padStart(2, "0");
      const minutes = String(ist.getMinutes()).padStart(2, "0");
      const seconds = String(ist.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (!isMounted || !contentRef.current) return;

      const tl = gsap.timeline();

      tl.to(contentRef.current, { opacity: 1, duration: 0.01 });

      // 1. Intro line slides in from below with opacity
      tl.fromTo(
        introLineRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" },
        0.1,
      );

      // 2. Heading splits each word with a mask-clip stagger
      tl.fromTo(
        ".heading-word",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.06,
        },
        0.2,
      );

      // 3. Footer row fades in
      tl.fromTo(
        footerRowRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
        0.7,
      );

      // 4. GIF slides in from right
      tl.fromTo(
        gifRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" },
        0.9,
      );
    },
    { scope: contentRef, dependencies: [isMounted] },
  );

  const headingWords = [
    { text: "Hii,", italic: false },
    { text: "I\u2019m", italic: false },
    { text: "Sudipta", italic: true },
    { text: "Sarkar\u2014", italic: true },
    { text: "an", italic: false },
    { text: "artist", italic: true, muted: true },
    { text: "&", italic: false },
    { text: "illustrator", italic: true, muted: true },
    { text: "exploring", italic: false },
    { text: "botanical", italic: true },
    { text: "beauty,", italic: false },
    { text: "warm", italic: false },
    { text: "palettes", italic: false },
    { text: "&", italic: false },
    { text: "lineart.", italic: true },
  ];

  return (
    <div className="flex min-h-screen md:h-screen flex-col bg-brand-bg font-sans selection:bg-brand-accent selection:text-brand-dark relative overflow-x-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.022] z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient warm glow — left */}
      <div
        className="pointer-events-none fixed top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full z-0"
        style={{
          background: "radial-gradient(circle, rgba(228,179,99,0.13) 0%, transparent 70%)",
        }}
      />
      {/* Ambient warm glow — right */}
      <div
        className="pointer-events-none fixed bottom-[10%] right-[-8%] w-[420px] h-[420px] rounded-full z-0"
        style={{
          background: "radial-gradient(circle, rgba(226,133,110,0.11) 0%, transparent 70%)",
        }}
      />

      {/* Horizontal editorial rule lines */}
      <div className="pointer-events-none fixed inset-0 z-0 flex flex-col justify-between py-[72px] px-6 md:px-16 opacity-[0.04]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-[1px] bg-brand-dark" />
        ))}
      </div>

      <Header />

      {/* Main Layout */}
      <main
        ref={contentRef}
        className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col justify-between px-6 md:px-12 lg:px-16 pb-10 md:pb-14 opacity-0 relative z-10"
      >
        {/* Top section: intro tag + mega heading */}
        <div className="flex-1 flex flex-col justify-center pt-4 md:pt-0">
          {/* Intro label row */}
          <div ref={introLineRef} className="flex items-center gap-4 mb-8 md:mb-10 opacity-0">
            <span className="h-[1px] w-12 bg-brand-dark/30" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-brand-dark/40 select-none">
              About the Artist
            </span>
          </div>

          {/* Mega headline with per-word mask animation */}
          <h1 className="font-serif font-normal text-[9.5vw] sm:text-[7vw] md:text-[5.5vw] lg:text-[4.2vw] xl:text-[3.8vw] leading-[1.08] tracking-tight text-brand-dark max-w-5xl">
            {headingWords.map((w, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden mr-[0.22em] last:mr-0 align-bottom"
              >
                <span
                  className={`heading-word inline-block ${w.italic ? "italic" : ""} ${w.muted ? "text-brand-muted" : ""}`}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Footer row: Location | Contact */}
        <div
          ref={footerRowRef}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 border-t border-black/[0.06] pt-8 md:pt-10 opacity-0 relative"
        >
          {/* Col 1 — Location */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-dark/35 select-none">
              Location
            </span>
            <p className="font-sans text-[14px] font-semibold text-brand-dark leading-snug">
              Kolkata, India
            </p>
            <p className="font-mono text-[11px] text-brand-muted select-none tabular-nums">
              {timeStr ? `${timeStr} IST` : "—"} <span className="text-brand-dark/30">•</span>{" "}
              <span className="text-brand-dark/40">GMT+5:30</span>
            </p>
          </div>

          {/* Col 2 — Availability */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-dark/35 select-none">
              Status
            </span>
            <p className="font-sans text-[14px] font-semibold text-brand-dark leading-snug flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8fa882] inline-block animate-pulse" />
              Available for commissions
            </p>
            <p className="font-sans text-[11px] text-brand-muted">
              Illustration · Portrait · Editorial
            </p>
          </div>

          {/* Col 3 — Contact */}
          <div className="flex flex-col gap-3 md:items-end">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-dark/35 select-none">
              Get in touch
            </span>
            <a
              href="mailto:sudiptasarkar@email.com"
              className="font-sans text-[14px] font-semibold text-brand-dark hover:text-brand-muted transition-colors relative group w-fit"
              data-cuelume-press="tick"
            >
              sudiptasarkar@email.com
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-dark/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
            <a
              href="https://www.instagram.com/bristtiiii/"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[14px] font-semibold text-brand-dark hover:text-brand-muted transition-colors relative group w-fit"
              data-cuelume-press="tick"
            >
              @bristtiiii on Instagram
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-dark/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          </div>
        </div>
      </main>

      {/* GIF — decorative, floats in the bottom-right */}
      <div
        ref={gifRef}
        className="pointer-events-none select-none fixed bottom-0 right-0 z-20 opacity-0 hidden md:block"
      >
        <div className="w-[340px] lg:w-[400px] h-[280px] lg:h-[330px] overflow-hidden translate-y-[30%] translate-x-[12%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gif/person-pointing-at-something.gif"
            alt=""
            aria-hidden="true"
            className="object-contain w-full h-full scale-x-[-1]"
          />
        </div>
      </div>
    </div>
  );
}
