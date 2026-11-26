import type { ReactNode } from "react";

export function AdminStatGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
    </section>
  );
}
