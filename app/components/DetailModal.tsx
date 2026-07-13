"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Artwork } from "./MasonryGrid";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface DetailModalProps {
  artwork: Artwork;
  onClose: () => void;
}

export default function DetailModal({ artwork, onClose }: DetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent scroll on body while detail panel is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // GSAP animation for opening modal layers (luxurious, slower, and ultra-smooth ease)
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Fade in the backdrop overlay slowly
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 0.35, duration: 1.0, ease: "power2.out" },
        0,
      );

      // 2. Slide in the panel from the right with a smooth, long deceleration curve
      tl.fromTo(
        panelRef.current,
        { x: "100%" },
        { x: "0%", duration: 1.25, ease: "power4.out" },
        0,
      );

      // 3. Scale up and fade in the image with subtle parameters
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.95, ease: "power3.out" },
        "-=0.9", // heavy overlap for organic blending
      );

      // 4. Slide up and fade in the text details
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "-=0.8",
      );
    },
    { scope: containerRef },
  );

  // Handle fully synchronized slide-out on close (drawer sliding away physically)
  const handleClose = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: onClose,
    });

    // 1. Slide out the main panel to the right (slower, highly cushioned ease)
    tl.to(
      panelRef.current,
      {
        x: "100%",
        duration: 1.15,
      },
      0,
    );

    // 2. Fade out the backdrop overlay in parallel
    tl.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
      },
      0.05,
    );
  }, [onClose]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden"
    >
      {/* Backdrop overlay (dark shade overlay managed by GSAP) */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-brand-dark cursor-pointer"
        style={{ opacity: 0 }}
        onClick={handleClose}
        data-cuelume-press="tick"
      />

      {/* Fullscreen Panel */}
      <div
        ref={panelRef}
        className="relative z-10 flex h-full w-full flex-col bg-brand-card shadow-2xl md:flex-row focus:outline-none"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/50 text-brand-dark hover:bg-brand-accent transition-colors focus:outline-none cursor-pointer"
          aria-label="Close detail panel"
          data-cuelume-press="tick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Image Viewer */}
        <div className="flex flex-1 items-center justify-center bg-brand-card p-6 md:p-12 overflow-hidden h-1/2 md:h-full border-b md:border-b-0 md:border-r border-black/[0.03]">
          <div
            ref={imageRef}
            className="relative h-full w-full flex items-center justify-center opacity-0 overflow-hidden"
          >
            {artwork.images && artwork.images.length > 1 ? (
              /* Figma Multi-Image Layout */
              <div className="flex flex-row gap-6 w-full h-[35vh] md:h-[70vh] items-stretch justify-center">
                {/* Main Featured Image */}
                <div className="flex-1 relative rounded-2xl overflow-hidden border border-black/[0.04] shadow-sm bg-brand-accent/20">
                  <Image
                    src={artwork.images[0]}
                    alt={`${artwork.title} featured`}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Vertical thumbnails stack */}
                <div className="flex flex-col gap-4 w-[120px] md:w-[240px] h-full overflow-y-auto scrollbar-none pr-1">
                  {artwork.images.slice(1).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-black/[0.04] shadow-sm flex-shrink-0 bg-brand-accent/20"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${artwork.title} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : artwork.imageUrl ? (
              /* Single Image Layout */
              <div className="relative h-full w-full flex items-center justify-center">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={artwork.width ?? 1200}
                  height={artwork.height ?? 900}
                  priority
                  className="max-h-[35vh] md:max-h-[75vh] w-auto object-contain rounded-2xl border border-black/[0.04] shadow-sm"
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Metadata details */}
        <div
          ref={textRef}
          className="flex w-full flex-col justify-between p-8 md:w-[460px] md:p-16 h-1/2 md:h-full overflow-y-auto opacity-0 bg-brand-card"
        >
          <div>
            {/* Project Client Name */}
            {artwork.client && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                {artwork.client}
              </span>
            )}

            {/* Title */}
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl">
              {artwork.title}
            </h2>

            {/* Description */}
            <p className="mt-8 font-sans text-sm leading-relaxed text-brand-muted">
              {artwork.description}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-black/[0.05]">
            {/* Details Table */}
            <div className="flex flex-col gap-4">
              <div>
                <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-brand-muted/70">
                  Tags
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(artwork.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-accent px-3.5 py-1.5 font-sans text-[11px] font-semibold text-brand-dark uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
