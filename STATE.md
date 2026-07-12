# Project State (STATE.md)

## Current Status
- Next.js 16.2.10 and Tailwind CSS v4 project fully configured.
- Edge-to-edge layout, transparent header, #FAF6EB website background, and GSAP drawer animations completed.
- Verified build compiles successfully.

## Tech Stack & Versions
- **Next.js**: 16.2.10 (App Router)
- **React / React DOM**: 19.2.4
- **Tailwind CSS**: 4.0.0
- **TypeScript**: 5.x
- **GSAP**: 3.12.5
- **@gsap/react**: 2.1.1

## Implementation Progress
- [x] Initial project setup
- [x] Mock illustration assets generation (`public/images/`)
- [x] Transparent Header (Scrolls out of view naturally, no blur/bg)
- [x] #FAF6EB website background theme
- [x] Masonry grid layout calculations & component (Client-side column balancing)
- [x] Work card component (with aspect ratio constraints and static image hover)
- [x] GSAP sliding detail panel overlay (Slides right-to-left to open, left-to-right to close)
- [x] Responsive cinematic split preloader grid (reduced box count on mobile, full grid on desktop)
- [x] About section (Typographic layout with select clients)
- [x] Contact section (Slide-out contact form overlay)
- [x] Detailed educational documentation (`how_it_works.md`)
- [x] Verification of production build (`npm run build`)
