"use client";

import { Button } from "@nina/ui-components";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  initialSeconds?: number;
  onTimeChange: (seconds: number) => void;
}

export function Timer({ initialSeconds = 0, onTimeChange }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    onTimeChange(seconds);
  }, [seconds, onTimeChange]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const adjustTime = (amount: number) => {
    setSeconds((prev) => Math.max(0, prev + amount));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-6xl font-mono font-bold tracking-wider">
        {formatTime(seconds)}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="icon" onClick={() => adjustTime(-15)}>
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          className={
            isRunning
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }
          onClick={toggleTimer}
        >
          {isRunning ? (
            <Pause className="mr-2 h-6 w-6" />
          ) : (
            <Play className="mr-2 h-6 w-6" />
          )}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" size="icon" onClick={() => adjustTime(15)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={resetTimer}
        className="text-destructive hover:text-destructive"
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reset
      </Button>
    </div>
  );
}
