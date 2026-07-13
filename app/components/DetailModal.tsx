"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { Artwork } from "./MasonryGrid";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface DetailModalProps {
  artwork: Artwork;
  onClose: () => void;
}

/* ─────────────────────────────────────────────
   Full-screen Lightbox (zoom + pan)
───────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // transform state
  const scale = useRef(1);
  const tx = useRef(0);
  const ty = useRef(0);

  // pointer drag
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // pinch
  const lastDist = useRef(0);

  const applyTransform = useCallback(() => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = `translate(${tx.current}px, ${ty.current}px) scale(${scale.current})`;
  }, []);

  const clampAndApply = useCallback(() => {
    scale.current = Math.max(0.5, Math.min(scale.current, 10));
    applyTransform();
  }, [applyTransform]);

  /* ── mouse wheel zoom ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      scale.current *= delta;
      clampAndApply();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampAndApply]);

  /* ── pointer drag (mouse + touch single) ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-lightbox-close]")) return;
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      tx.current += e.clientX - lastX.current;
      ty.current += e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      applyTransform();
    };
    const onPointerUp = () => {
      dragging.current = false;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [applyTransform]);

  /* ── touch pinch-to-zoom ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastDist.current > 0) {
          scale.current *= dist / lastDist.current;
          clampAndApply();
        }
        lastDist.current = dist;
      }
    };
    const onTouchEnd = () => {
      lastDist.current = 0;
    };

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [clampAndApply]);

  /* ── double-click to reset ── */
  const handleDoubleClick = () => {
    scale.current = 1;
    tx.current = 0;
    ty.current = 0;
    applyTransform();
  };

  /* ── Escape to close ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 cursor-grab active:cursor-grabbing select-none"
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: "none" }}
    >
      {/* Controls bar */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4"
        data-lightbox-close
        style={{ pointerEvents: "none" }}
      >
        {/* Zoom hint */}
        <span className="font-sans text-[11px] text-white/40 tracking-widest uppercase">
          Scroll · Pinch · Drag &nbsp;|&nbsp; Double-click to reset
        </span>

        {/* Close button */}
        <button
          onClick={onClose}
          data-lightbox-close
          style={{ pointerEvents: "auto" }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Zoom control buttons */}
      <div
        className="absolute bottom-6 right-6 z-10 flex flex-col gap-2"
        data-lightbox-close
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={() => {
            scale.current = Math.min(scale.current * 1.3, 10);
            clampAndApply();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors focus:outline-none cursor-pointer text-xl font-light"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => {
            scale.current = Math.max(scale.current / 1.3, 0.5);
            clampAndApply();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors focus:outline-none cursor-pointer text-xl font-light"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => {
            scale.current = 1;
            tx.current = 0;
            ty.current = 0;
            applyTransform();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors focus:outline-none cursor-pointer"
          aria-label="Reset zoom"
          title="Reset"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
            />
          </svg>
        </button>
      </div>

      {/* The image itself */}
      <div
        ref={imgRef}
        className="relative"
        style={{ willChange: "transform", transformOrigin: "center center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
            display: "block",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Detail Modal
───────────────────────────────────────────── */
export default function DetailModal({ artwork, onClose }: DetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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

  // Resolve the primary image src for the fullscreen button
  const primarySrc =
    artwork.images && artwork.images.length > 0 ? artwork.images[0] : (artwork.imageUrl ?? null);

  return (
    <>
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
          <div className="flex flex-1 items-center justify-center bg-brand-card p-6 md:p-12 overflow-hidden h-1/2 md:h-full border-b md:border-b-0 md:border-r border-black/[0.03] relative">
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
                      loading="eager"
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
                    loading="eager"
                    className="max-h-[35vh] md:max-h-[75vh] w-auto object-contain rounded-2xl border border-black/[0.04] shadow-sm"
                  />
                </div>
              ) : null}
            </div>

            {/* ── Fullscreen Button (always visible, bottom-right of image column) ── */}
            {primarySrc && (
              <button
                onClick={() => setLightboxSrc(primarySrc)}
                className="
                  absolute bottom-4 right-4
                  flex items-center gap-2
                  min-h-[44px] px-4 py-2.5
                  rounded-2xl
                  bg-black/75 hover:bg-black/95 active:scale-95
                  text-white
                  font-sans text-[11px] font-semibold uppercase tracking-widest
                  transition-all duration-150
                  focus:outline-none cursor-pointer
                  backdrop-blur-md
                  shadow-xl
                  z-20
                  border border-white/10
                "
                aria-label="View fullscreen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-4 w-4 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
                <span className="hidden sm:inline">View Fullscreen</span>
                <span className="sm:hidden">Full</span>
              </button>
            )}
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

      {/* Lightbox Portal */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} alt={artwork.title} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
