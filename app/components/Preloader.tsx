"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface PreloaderProps {
  onComplete: () => void;
}

// Global state to track if preloader has already played in the current browser session.
// This persists across client-side route transitions, preventing the preloader from running
// when navigating back and forth from the /about page, but resets on a manual browser refresh.
export let preloaderPlayed = false;

if (typeof window !== "undefined") {
  preloaderPlayed = (window as any).__preloaderPlayed === true;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  // Track the initial session state on component mount, ignoring state changes
  // while the component is active to prevent unmounting during running GSAP timelines.
  const [shouldSkip] = useState(preloaderPlayed);
  const [isMounted, setIsMounted] = useState(false);
  const [grid, setGrid] = useState({ cols: 10, rows: 8 });

  useEffect(() => {
    if (shouldSkip) {
      onComplete();
      setIsMounted(true);
      return;
    }
    if (window.innerWidth < 768) {
      setGrid({ cols: 5, rows: 6 });
    }
    setIsMounted(true);
  }, [shouldSkip, onComplete]);

  const { cols, rows } = grid;

  // Generate grid boxes with percentage layout and dynamic overlaps to prevent subpixel gaps
  const boxes = useMemo(() => {
    if (shouldSkip) return [];
    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          id: `${r}-${c}`,
          top: `${(r / rows) * 100}%`,
          left: `${(c / cols) * 100}%`,
          width: `calc(${100 / cols}% + 1px)`,
          height: `calc(${100 / rows}% + 1px)`,
        });
      }
    }
    return list;
  }, [rows, cols, shouldSkip]);

  useGSAP(() => {
    if (!isMounted || shouldSkip) return;

    // Disable scroll on body while preloading
    document.body.style.overflow = "hidden";

    const boxElements = gsap.utils.toArray(".preloader-box");
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
      },
    });

    // 1. Brand name fades in and slides up smoothly
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power4.out" }
    );

    // 2. Pause to allow reading
    tl.to({}, { duration: 0.7 });

    // 3. Name fades out and slides up
    tl.to(nameRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.55,
      ease: "power3.in",
    });

    // 4. Staggered Shutter Box Reveal
    // Animates the boxes to slide all the way up and off-screen
    // Stagger starts from bottom-left [0, 1] (column 0, row 1)
    tl.to(
      boxElements,
      {
        y: -(window.innerHeight + 100),
        force3D: true,
        duration: 1.25,
        ease: "power4.inOut",
        stagger: {
          grid: [rows, cols],
          from: (rows - 1) * cols, // Bottom-left corner index ((rows-1)*cols)
          amount: window.innerWidth < 768 ? 1.0 : 1.5,
        },
        onStart: () => {
          onComplete(); // Start revealing content under the rolling shutter
          preloaderPlayed = true; // Mark preloader as played
          if (typeof window !== "undefined") {
            (window as any).__preloaderPlayed = true;
          }
        }
      },
      "-=0.25" // Overlap slightly with name fade out
    );

    // 5. Hide the preloader container
    tl.to(containerRef.current, {
      display: "none",
      duration: 0,
    });

    // Cleanup: restore body overflow on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, { dependencies: [isMounted, cols, rows], scope: containerRef });

  if (shouldSkip) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none bg-transparent"
    >
      {/* Grid of Shutter Boxes (covering the entire screen) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="preloader-box absolute bg-brand-bg"
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Layered Typographic Center Panel */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Foreground Sharp Elegant Name */}
        <div
          ref={nameRef}
          className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-[0.3em] text-brand-dark pointer-events-none opacity-0"
        >
          Sudipta Sarkar
        </div>
      </div>
    </div>
  );
}
