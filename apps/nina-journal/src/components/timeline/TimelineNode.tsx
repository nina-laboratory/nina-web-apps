import type { Release } from "@nina/nina-core";
import { cn } from "@nina/ui-components";

import Link from "next/link";

interface TimelineNodeProps {
  release: Release;
  isCurrent: boolean;
}

export function TimelineNode({ release, isCurrent }: TimelineNodeProps) {
  return (
    <div className="relative flex flex-col items-center group min-w-[120px]">
      {/* Date & Version Label (Top) */}
      {/* Date & Version Label (Top) */}
      <Link
        href={`/releases/${release.id}`}
        className="mb-2 flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity focus:outline-none"
      >
        <span className="text-[10px] font-bold tracking-wide uppercase text-primary/80">
          {release.id}
        </span>
      </Link>

      {/* Node Dot */}
      <Link
        href={`/releases/${release.id}`}
        className="relative z-10 p-2 -m-2 focus:outline-none"
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 transition-all duration-300",
            isCurrent
              ? "bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
              : "bg-background border-muted-foreground group-hover:border-primary group-hover:scale-110",
          )}
        />
        {/* Pulsing effect for current */}
        {isCurrent && (
          <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-primary/30 animate-ping pointer-events-none" />
        )}
      </Link>

      {/* Info Card (Bottom - Hover / Popover style visually) */}
      <div className="mt-4 absolute top-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 w-48 z-20 pointer-events-none group-hover:pointer-events-auto">
        <div className="bg-card border shadow-lg rounded-md p-3 text-center">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">
            {release.title}
          </h3>
          <div className="flex flex-wrap justify-center gap-1">
            {release.apps.slice(0, 2).map((app) => (
              <span
                key={app}
                className="text-[9px] px-1 bg-secondary rounded text-secondary-foreground"
              >
                {app}
              </span>
            ))}
            {release.apps.length > 2 && (
              <span className="text-[9px] text-muted-foreground">
                +{release.apps.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
