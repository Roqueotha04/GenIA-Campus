import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.22em]">
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {children}
    </span>
  );
}
