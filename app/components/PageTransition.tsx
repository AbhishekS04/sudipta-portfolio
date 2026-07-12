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

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // SVG Path Morph Coordinates
  // Initial: Flat line at the bottom of the screen (y=100)
  const initialPath = "M 0 100 L 100 100 L 100 100 Q 50 100 0 100 Z";

  // Mid-Close: Center of the wave rising faster than sides, bulging upwards (y=50 on sides, y=15 in center)
  const midClosePath = "M 0 100 L 100 100 L 100 50 Q 50 15 0 50 Z";

  // Full-Close: Fully covering the screen (y=0)
  const fullClosePath = "M 0 100 L 100 100 L 100 0 Q 50 0 0 0 Z";

  // Mid-Open: Center of the bottom edge rising faster than sides (y=50 on sides, y=15 in center)
  const midOpenPath = "M 0 0 L 100 0 L 100 50 Q 50 15 0 50 Z";

  // Full-Open: Completely off-screen at the top (y=0)
  const fullOpenPath = "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z";

  // Trigger page transition
  const startTransition = (href: string) => {
    if (pathname === href) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    document.body.style.overflow = "hidden";

    // Play visual feedback sound
    try {
      play("tick");
    } catch (e) {
      console.warn("Audio feedback failed:", e);
    }

    // Show overlay container
    gsap.set(containerRef.current, { display: "block" });

    // Reset path to starting flat bottom line
    gsap.set(pathRef.current, { attr: { d: initialPath } });

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      },
    });

    // Animate wave rising and morphing closed
    tl.to(pathRef.current, {
      attr: { d: midClosePath },
      duration: 0.38,
      ease: "power2.out",
    }).to(pathRef.current, {
      attr: { d: fullClosePath },
      duration: 0.32,
      ease: "power2.in",
    });
  };

  // Route change detection to morph reveal
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      if (isTransitioning) {
        // Settle delay (120ms) allows the new page component (e.g. Masonry grid)
        // to finish mounting and layout calculations on the main thread before starting the animation.
        const timer = setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              setIsTransitioning(false);
              document.body.style.overflow = "";
              gsap.set(containerRef.current, { display: "none" });
            },
          });

          // Set starting state for reveal (fully covered)
          gsap.set(pathRef.current, { attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z" } });

          // Animate wave bottom edge rising up and morphing off-screen
          tl.to(pathRef.current, {
            attr: { d: midOpenPath },
            duration: 0.42,
            ease: "power2.out",
          }).to(pathRef.current, {
            attr: { d: fullOpenPath },
            duration: 0.38,
            ease: "power2.inOut",
          });
        }, 120);

        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isTransitioning]);

  return (
    <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}

      {/* Liquid Wave Transition Overlay (with GPU Acceleration hints) */}
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
          preserveAspectRatio="none"
          className={`absolute inset-0 w-full h-full ${
            isTransitioning ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        >
          <path
            ref={pathRef}
            fill="#E5E0D5"
            d={initialPath}
            style={{
              willChange: "transform, d",
            }}
          />
        </svg>
      </div>
    </PageTransitionContext.Provider>
  );
}
