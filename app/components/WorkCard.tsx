"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Artwork } from "./MasonryGrid";

interface WorkCardProps {
  item: Artwork;
}

export default function WorkCard({ item }: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Fall back to 4:3 if metadata dimensions are missing
  const w = item.width ?? 1200;
  const h = item.height ?? 900;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col w-full overflow-hidden"
    >
      {/* Media container — enforced aspect ratio prevents layout shifts */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-brand-accent dynamic-aspect-ratio"
        style={{ "--aspect-ratio": `${w} / ${h}` } as React.CSSProperties}
      >
        {item.videoUrl ? (
          /* ── VIDEO CARD ── */
          <video
            src={item.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : item.imageUrl ? (
          /* ── IMAGE CARD ── */
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={w}
            height={h}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Multi-media indicator badge */}
        {item.imagesCount > 1 && (
          <div className="absolute top-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            1/{item.imagesCount}
          </div>
        )}

        {/* Video badge */}
        {item.videoUrl && (
          <div className="absolute top-4 left-4 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            ▶ Video
          </div>
        )}
      </div>

      {/* Label and tags */}
      <div className="mt-3.5 px-1">
        <h3 className="font-display text-base font-semibold text-brand-dark transition-colors duration-200 group-hover:text-brand-dark/80">
          {item.title}
        </h3>
        <div className="relative mt-1 min-h-[18px] w-full overflow-hidden">
          {/* Tags layer: fades out and slides up on hover */}
          <div className="transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-2 translate-y-0 opacity-100">
            <p className="flex flex-wrap gap-x-2 text-xs font-medium text-brand-muted">
              {(item.tags ?? []).map((tag) => (
                <span key={tag} className="before:content-['#']">
                  {tag}
                </span>
              ))}
            </p>
          </div>

          {/* View Project text layer: slides up from bottom and fades in on hover */}
          <div className="absolute inset-0 flex items-center opacity-0 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              View Project
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}


