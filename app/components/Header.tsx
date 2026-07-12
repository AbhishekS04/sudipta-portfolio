"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onNavigate?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      onNavigate(e, href);
    }
  };

  return (
    <header className="w-full px-6 py-6 md:px-12 lg:px-16 bg-transparent">
      <div className="mx-auto flex w-full items-center justify-between">

        {/* Left Side: Doodle & Name */}
        <Link 
          href="/" 
          className="flex items-center gap-3 cursor-pointer"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          <Image
            src="/images/doodle.svg"
            alt="Sudipta Sarkar doodle"
            width={36}
            height={36}
          />
          <span className="font-display font-bold text-lg md:text-xl tracking-tight text-brand-dark">
            Sudipta Sarkar
          </span>
        </Link>

        {/* Right Side: About Me link only */}
        <Link
          href={isAboutPage ? "/" : "/about"}
          className="rounded-full bg-brand-dark px-5 py-2.5 font-sans text-xs font-bold tracking-wider uppercase text-brand-bg hover:bg-brand-dark/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none cursor-pointer"
          data-cuelume-press="tick"
          onClick={(e) => handleLinkClick(e, isAboutPage ? "/" : "/about")}
        >
          {isAboutPage ? "Close" : "About Me"}
        </Link>
      </div>
    </header>
  );
}
