"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { play } from "cuelume";

gsap.registerPlugin(useGSAP);

interface PageTransitionContextProps {
  startTransition: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextProps | undefined>(undefined);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}

// 4 Gorgeous Editorial Brand Color Shades (Staggered Ripple)
// Last color is #faf6eb which is the page background color (for seamless blend)
const transitionColors = [
  "#8fa882", // Layer 1: Sage Green
  "#e4b363", // Layer 2: Ochre Gold
  "#e2856e", // Layer 3: Terracotta/Coral
  "#faf6eb", // Layer 4: Cream (Main page background)
];

// SVG Morph Coordinates for Bottom to Top ("up")
const initialPathUp = "M 0 100 L 100 100 L 100 100 Q 50 100 0 100 Z";
const midClosePathUp = "M 0 100 L 100 100 L 100 50 Q 50 30 0 50 Z";
const fullClosePathUp = "M 0 100 L 100 100 L 100 0 Q 50 0 0 0 Z";
const startRevealPathUp = "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z";
const midOpenPathUp = "M 0 0 L 100 0 L 100 50 Q 50 30 0 50 Z";
const fullOpenPathUp = "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z";

// SVG Morph Coordinates for Top to Bottom ("down")
const initialPathDown = "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z";
const midClosePathDown = "M 0 0 L 100 0 L 100 50 Q 50 70 0 50 Z";
const fullClosePathDown = "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z";
const startRevealPathDown = "M 0 100 L 100 100 L 100 0 Q 50 0 0 0 Z";
const midOpenPathDown = "M 0 100 L 100 100 L 100 50 Q 50 70 0 50 Z";
const fullOpenPathDown = "M 0 100 L 100 100 L 100 100 Q 50 100 0 100 Z";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger page transition
  const startTransition = (href: string) => {
    if (pathname === href) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    if (
      typeof window !== "undefined" &&
      (window as unknown as { lenis?: { stop: () => void } }).lenis
    ) {
      (window as unknown as { lenis: { stop: () => void } }).lenis.stop();
    }

    // Set transition direction:
    // Going to about or qr is bottom-to-top ("up"). Returning to home is top-to-bottom ("down")
    const direction = href === "/about" || href === "/qr" ? "up" : "down";
    setDirection(direction);

    const initialPath = direction === "up" ? initialPathUp : initialPathDown;
    const midClosePath = direction === "up" ? midClosePathUp : midClosePathDown;
    const fullClosePath = direction === "up" ? fullClosePathUp : fullClosePathDown;

    try {
      play("tick");
    } catch (e) {
      console.warn("Audio feedback failed:", e);
    }

    // Show overlay container
    gsap.set(containerRef.current, { display: "block" });

    // Set initial path state for all layers
    pathsRef.current.forEach((path) => {
      if (path) {
        gsap.set(path, { attr: { d: initialPath } });
      }
    });

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      },
    });

    // Animate wave rising/falling and morphing closed (Stagger from bottom layer to top layer)
    pathsRef.current.forEach((path, idx) => {
      if (!path) return;

      const staggerDelay = idx * 0.12;

      tl.to(
        path,
        {
          attr: { d: midClosePath },
          duration: 0.45,
          ease: "power3.out",
        },
        staggerDelay,
      ).to(
        path,
        {
          attr: { d: fullClosePath },
          duration: 0.4,
          ease: "power3.inOut",
        },
        staggerDelay + 0.3,
      );
    });
  };

  // Route change detection to morph reveal
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      if (isTransitioning) {
        const timer = setTimeout(() => {
          const startRevealPath = direction === "up" ? startRevealPathUp : startRevealPathDown;
          const midOpenPath = direction === "up" ? midOpenPathUp : midOpenPathDown;
          const fullOpenPath = direction === "up" ? fullOpenPathUp : fullOpenPathDown;

          const tl = gsap.timeline({
            onComplete: () => {
              setIsTransitioning(false);
              if (
                typeof window !== "undefined" &&
                (window as unknown as { lenis?: { start: () => void } }).lenis
              ) {
                (window as unknown as { lenis: { start: () => void } }).lenis.start();
              }
              gsap.set(containerRef.current, { display: "none" });
            },
          });

          // Set starting reveal state for all layers
          pathsRef.current.forEach((path) => {
            if (path) {
              gsap.set(path, { attr: { d: startRevealPath } });
            }
          });

          // Animate reveal staggered (Reverse stagger: top layer reveals first to uncover layers below)
          pathsRef.current.forEach((path, idx) => {
            if (!path) return;

            const staggerDelay = (3 - idx) * 0.12;

            tl.to(
              path,
              {
                attr: { d: midOpenPath },
                duration: 0.5,
                ease: "power3.out",
              },
              staggerDelay,
            ).to(
              path,
              {
                attr: { d: fullOpenPath },
                duration: 0.45,
                ease: "power3.inOut",
              },
              staggerDelay + 0.35,
            );
          });
        }, 120);

        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isTransitioning, direction]);

  return (
    <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {/* Page Content wrapper */}
      <div className="w-full min-h-screen flex flex-col">{children}</div>

      {/* Layered Liquid Wave Transition Overlay (with GPU Acceleration hints) */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] pointer-events-none select-none"
        style={{
          display: "none",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          className={`absolute inset-0 w-full h-full ${
            isTransitioning ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        >
          {transitionColors.map((color, idx) => (
            <path
              key={color}
              ref={(el) => {
                pathsRef.current[idx] = el;
              }}
              fill={color}
              d={direction === "up" ? initialPathUp : initialPathDown}
              style={{
                willChange: "transform, d",
              }}
            />
          ))}
        </svg>
      </div>
    </PageTransitionContext.Provider>
  );
}
