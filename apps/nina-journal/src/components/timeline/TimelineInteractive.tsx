"use client";

import type { Release } from "@nina/nina-core";
import { Button } from "@nina/ui-components";
import { differenceInDays, endOfYear, startOfYear } from "date-fns";
import { ArrowRight } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { TimelineNode } from "./TimelineNode";

interface TimelineInteractiveProps {
  releases: Release[];
}

const PIXELS_PER_DAY = 6; // Adjust scale here. 365 * 6 ~= 2190px width
const MIN_WIDTH = 1200; // Minimum width to ensure it doesn't look cramped on empty years

export function TimelineInteractive({ releases }: TimelineInteractiveProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showGoToCurrent, setShowGoToCurrent] = useState(false);

  // Identify current release (last one in the sorted list)
  const currentReleaseId =
    releases.length > 0 ? releases[releases.length - 1].id : null;

  // Calculate layout metrics based on the year of the data
  const metrics = useMemo(() => {
    if (releases.length === 0) return { width: MIN_WIDTH, positions: {} };

    // Assume all releases are in the same year as the first one for now
    // or parse the year from search param if we had it.
    // Safer: use the year of the first release.
    const year = releases[0].date.getFullYear();
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    const totalDays = differenceInDays(end, start);

    const totalWidth = Math.max(totalDays * PIXELS_PER_DAY, MIN_WIDTH);

    // Map release ID to pixel position
    const positions: Record<string, number> = {};
    releases.forEach((r) => {
      const days = differenceInDays(r.date, start);
      // Add padding (e.g. 100px) so Jan 1st isn't glued to the edge
      positions[r.id] = days * PIXELS_PER_DAY + 100;
    });

    return { width: totalWidth + 200, positions }; // +200 for end padding
  }, [releases]);

  const scrollToCurrent = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  // Check scroll position to toggle button visibility
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    // Show button if we are not at the end (roughly)
    const isAtEnd = scrollWidth - (scrollLeft + clientWidth) < 50;
    setShowGoToCurrent(!isAtEnd);
  };

  // Initial scroll to end on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative w-full">
      {/* Controls */}
      <div
        className={`absolute top-0 right-4 z-20 transition-opacity duration-300 ${showGoToCurrent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Button
          size="sm"
          onClick={scrollToCurrent}
          variant="secondary"
          className="shadow-md gap-2"
        >
          Go to Current <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full overflow-x-auto overflow-y-visible py-24 px-0 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent select-none cursor-grab active:cursor-grabbing"
      >
        {/* Visual Timeline Wrapper */}
        <div className="relative h-20" style={{ width: `${metrics.width}px` }}>
          {/* Central Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

          {/* Nodes */}
          {releases.map((release) => (
            <div
              key={release.id}
              className="absolute top-1/2 -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110 -translate-x-1/2"
              style={{ left: `${metrics.positions[release.id]}px` }}
            >
              <TimelineNode
                release={release}
                isCurrent={release.id === currentReleaseId}
              />
            </div>
          ))}

          {/* End arrow/cap */}
          <div className="absolute top-1/2 right-0 flex items-center text-muted-foreground -translate-y-1/2 pr-8">
            <ArrowRight className="h-4 w-4 text-border" />
            <span className="ml-2 text-xs font-mono uppercase tracking-wider text-muted-foreground/50">
              Future
            </span>
          </div>
        </div>
      </div>

      {/* Fade gradients */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-30" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-30" />
    </div>
  );
}
