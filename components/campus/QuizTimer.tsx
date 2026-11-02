"use client";

import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { formatClock } from "@/lib/format-clock";

export function QuizTimer() {
  const elapsedSeconds = useElapsedSeconds();

  return (
    <div className="border-t border-line pt-6">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
        Tiempo transcurrido
      </p>
      <p
        role="timer"
        className="mt-3 font-heading text-4xl font-semibold tabular-nums tracking-tight text-foreground"
      >
        {formatClock(elapsedSeconds)}
      </p>
    </div>
  );
}
