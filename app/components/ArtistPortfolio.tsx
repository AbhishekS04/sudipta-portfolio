"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import MasonryGrid, { Artwork } from "./MasonryGrid";
import DetailModal from "./DetailModal";
import Preloader, { preloaderPlayed } from "./Preloader";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { bind, play } from "cuelume";

gsap.registerPlugin(useGSAP);

interface ArtistPortfolioProps {
  initialArtworks: Artwork[];
}

export default function ArtistPortfolio({ initialArtworks }: ArtistPortfolioProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Initialize interactive UI sounds
  useEffect(() => {
    const played = typeof window !== "undefined" && (window as any).__preloaderPlayed === true;
    isFirstRender.current = !played;
    if (played) {
      setPreloaderComplete(true);
    }
    
    bind();

    // Mobile Web Audio API requires a user-gesture to unlock the AudioContext.
    // Triggers play("tick") on the first interaction to enable sounds.
    const unlockAudio = () => {
      try {
        play("tick");
      } catch (e) {
        console.warn("Audio unlock failed:", e);
      }
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  // Stagger entry animation for Header, Main content, and Footer after preloader completes
  useGSAP(() => {
    if (!preloaderComplete || !contentRef.current) return;

    // Skip staggered entrance animation on subsequent route navigations
    if (!isFirstRender.current) {
      const children = Array.from(contentRef.current.children);
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }

    const children = Array.from(contentRef.current.children);
    gsap.fromTo(
      children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
      }
    );
  }, [preloaderComplete]);

  return (
    <>
      {/* Cinematic Split Preloader */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />

      {/* Main Page Layout Wrapper */}
      <div
        ref={contentRef}
        className="flex min-h-screen flex-col bg-brand-bg font-sans selection:bg-brand-accent selection:text-brand-dark"
      >
        {/* Header Sticky Navbar */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          <div className="w-full px-6 py-8 md:px-12 lg:px-16 md:py-12">
            <MasonryGrid items={initialArtworks} onArtworkClick={setSelectedArtwork} />
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-transparent py-12 px-6 md:px-12 lg:px-16 text-center">
          <p className="text-xs font-medium text-brand-muted">
            © 2026 Sudipta Sarkar. All rights reserved.
          </p>
        </footer>

        {/* Detail Modal */}
        {selectedArtwork && (
          <DetailModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
        )}
      </div>
    </>
  );
}
