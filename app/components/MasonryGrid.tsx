"use client";

import React, { useState, useEffect } from "react";
import WorkCard from "./WorkCard";

export interface Artwork {
  id: string;
  title: string;
  client: string;
  tags: string[];
  imageUrl: string | null;
  videoUrl?: string | null;
  width: number;
  height: number;
  description: string;
  imagesCount: number;
  images?: string[];
}

interface MasonryGridProps {
  items: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export default function MasonryGrid({ items, onArtworkClick }: MasonryGridProps) {
  const [columnCount, setColumnCount] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  // Set column counts based on screen width
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    // Initialize on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // JS Height-Balancing Masonry Algorithm
  const getBalancedColumns = () => {
    // Initialize empty columns
    const columns: Artwork[][] = Array.from({ length: columnCount }, () => []);
    // Track cumulative heights of each column
    const columnHeights = Array(columnCount).fill(0);

    items.forEach((item) => {
      // Find the index of the column with the minimum height
      let minColumnIndex = 0;
      let minHeight = columnHeights[0];

      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < minHeight) {
          minHeight = columnHeights[i];
          minColumnIndex = i;
        }
      }

      // Add item to the shortest column
      columns[minColumnIndex].push(item);
      
      // Calculate aspect ratio height factor (height / width)
      // A taller image has a higher height factor, contributing more to the column height.
      const heightFactor = item.height / item.width;
      columnHeights[minColumnIndex] += heightFactor;
    });

    return columns;
  };

  // Pre-mount / Server-side Rendering Fallback (Standard CSS grid for SEO)
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} onClick={() => onArtworkClick(item)} className="cursor-pointer" data-cuelume-press="tick">
            <WorkCard item={item} />
          </div>
        ))}
      </div>
    );
  }

  // Client-side height-balanced columns
  const columns = getBalancedColumns();

  return (
    <div className="flex w-full gap-8">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="flex flex-1 flex-col gap-8">
          {column.map((item) => (
            <div key={item.id} onClick={() => onArtworkClick(item)} className="cursor-pointer" data-cuelume-press="tick">
              <WorkCard item={item} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
