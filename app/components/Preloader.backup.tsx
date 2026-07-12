"use client";

import React, { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  // Define shutter grid dimensions
  const cols = 10;
  const rows = 8;

  // Generate grid boxes with percentage layout
  const boxes = useMemo(() => {
    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          id: `${r}-${c}`,
          top: `${(r / rows) * 100}%`,
          left: `${(c / cols) * 100}%`,
          width: `${100 / cols}%`,
          height: `${100 / rows}%`,
        });
      }
    }
    return list;
  }, [rows, cols]);

  useGSAP(() => {
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
        y: "-105vh",
        duration: 1.25,
        ease: "power4.inOut",
        stagger: {
          grid: [rows, cols],
          from: 70, // Bottom-left corner index ((rows-1)*cols)
          amount: 1.5,
        },
        onStart: () => {
          onComplete(); // Start revealing content under the rolling shutter
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
  }, { scope: containerRef });

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
            className="preloader-box absolute bg-[#FDFDFB] border border-black/[0.005]"
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
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
