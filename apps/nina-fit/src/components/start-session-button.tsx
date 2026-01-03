"use client";

import { Button } from "@nina/ui-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartSessionButton() {
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const router = useRouter();

  // Use local date YYYY-MM-DD as ID
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

  const handleStartRetroactive = () => {
    if (!selectedDate) return;
    router.push(`/session/${selectedDate}`);
  };

  if (isSelectingDate) {
    return (
      <div className="w-full space-y-2 animate-in fade-in slide-in-from-top-2">
        <label htmlFor="retro-date" className="text-sm font-medium">
          Select Date
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            id="retro-date"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            max={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Button onClick={handleStartRetroactive} disabled={!selectedDate}>
            Go
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setIsSelectingDate(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Link href={`/session/${today}`} className="w-full">
        <Button size="lg" className="w-full">
          Start Today's Session
        </Button>
      </Link>

      <button
        type="button"
        onClick={() => setIsSelectingDate(true)}
        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors w-full text-center py-3"
      >
        Or log for another day
      </button>
    </div>
  );
}
