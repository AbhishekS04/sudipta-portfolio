"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";

interface HeaderProps {
  onNavigate?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";
  const { startTransition } = usePageTransition();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(e, href);
    } else {
      startTransition(href);
    }
  };

  return (
    <header className="w-full px-6 py-6 md:px-12 lg:px-16 bg-transparent">
      <div className="mx-auto flex w-full items-center justify-between">

        {/* Left Side: Doodle & Name */}
        <Link 
          href="/" 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          <div className="relative w-9 h-9 overflow-hidden transition-transform duration-300 group-hover:rotate-12">
            <Image
              src="/images/doodle.svg"
              alt="Sudipta Sarkar doodle"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display font-bold text-lg md:text-xl tracking-tight text-brand-dark group-hover:text-brand-dark/80 transition-colors">
            Sudipta Sarkar
          </span>
        </Link>

        {/* Right Side: Conditional Action Link */}
        {isAboutPage ? (
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={(e) => handleLinkClick(e, "/")}
            data-cuelume-press="tick"
          >
            <span className="font-sans text-[11px] font-bold tracking-wider uppercase text-brand-dark/70 group-hover:text-brand-dark transition-colors">
              Close
            </span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-black/[0.1] bg-brand-bg group-hover:bg-brand-dark group-hover:text-brand-bg group-hover:scale-105 active:scale-95 transition-all duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </Link>
        ) : (
          <Link
            href="/about"
            className="rounded-full bg-brand-dark px-5 py-2.5 font-sans text-xs font-bold tracking-wider uppercase text-brand-bg hover:bg-brand-dark/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none cursor-pointer"
            data-cuelume-press="tick"
            onClick={(e) => handleLinkClick(e, "/about")}
          >
            About Me
          </Link>
        )}
      </div>
    </header>
  );
}
