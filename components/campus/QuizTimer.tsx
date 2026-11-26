"use client";

import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { formatClock } from "@/lib/format-clock";

export function QuizTimer() {
  const elapsedSeconds = useElapsedSeconds();

  return (
    <div className="border-t border-line pt-4">
      <p className="text-sm text-muted">
        Tiempo transcurrido
      </p>
      <p
        role="timer"
        className="mt-1 font-heading text-2xl font-semibold tabular-nums text-foreground"
      >
        {formatClock(elapsedSeconds)}
      </p>
    </div>
  );
}
