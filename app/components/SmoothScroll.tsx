"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true, // enable smooth scroll on mobile/touch screens
      syncTouchLerp: 0.08, // slightly lower lerp for smoother touch damping
      touchMultiplier: 1.2, // control touch sensitivity to prevent quick twitch jitters
    });

    // Use GSAP ticker to run Lenis's raf loop for unified rendering
    function update(time: number) {
      lenis.raf(time * 1000); // convert seconds to milliseconds
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
